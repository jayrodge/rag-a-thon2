import re
from serpapi import GoogleSearch
import os
import json
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse, parse_qs
from tqdm import tqdm
from groq import Groq
import urllib.request
import folium
from geopy.geocoders import Nominatim
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
import time


GS_URL = "https://scholar.google.com/citations?view_op=list_works&hl=en&hl=en&user=8Yd0UkIAAAAJ"
CACHE_PATH = "cache.json"
OUT_PATH = "/home/amala/Projects/rag-a-thon2"
MAP_FNAME = "map.html"
AFFILIATION_EXTRACTION_PROMPT = "Given the affiliation of a person taken from Google Scholar, extract the following information only if it is available - Job title, Institution, Department, Location. Do not write a script to do this task, directly provide the output. If any of these fields is not in the string, the corresponding value should be None. Do not print anything other than the output. For example, say this is the input - Associate Professor, University of Bari. Your job is to only output this and nothing more - Job_title:Associate Professor,Institution:University of Bari,Department:None,Location:None. Input:{}"


def get_map_coordinates(location_name):
    time.sleep(3)
    geolocator = Nominatim(user_agent="location_mapper")
    location = geolocator.geocode(location_name)
    if location:
        loc = (location.latitude, location.longitude)
        return loc
    return None


def plot_locations_on_map(location_coordinates):
    locations = list(location_coordinates.keys())
    # Initialize the map centered around the first location
    first_location = location_coordinates[locations[0]]
    my_map = folium.Map(location=first_location, zoom_start=5)

    # Add markers for each location
    for loc in locations:
        coords = location_coordinates[loc]
        # print(loc, coords)
        if coords:
            folium.Marker(location=coords, popup=loc).add_to(my_map)

    # Save the map as HTML
    map_html = os.path.join(OUT_PATH, MAP_FNAME)
    my_map.save(map_html)

    # Convert the HTML map to an image using Selenium
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=options)
    
    driver.get(f'file://{map_html}')
    time.sleep(3)  # Wait for the map to load

    # # Save the screenshot
    # driver.save_screenshot(output_file)
    # driver.quit()

    # print(f"Map saved as {output_file}")


def extract_parameters(url):
    """Extract 'as_sdt', 'cites', and 'start' parameters from the URL."""
    # Parse the URL and extract query parameters
    parsed_url = urlparse(url)
    query_params = parse_qs(parsed_url.query)

    # Extract the specific parameters
    as_sdt = query_params.get('as_sdt', ['N/A'])[0]
    cites = query_params.get('cites', ['N/A'])[0]
    start = query_params.get('start', ['N/A'])[0]

    print(url)
    print(f"as_sdt: {as_sdt}")
    print(f"cites: {cites}")
    print(f"start: {start}")

    return {
        'as_sdt': as_sdt,
        'cites': cites,
        'start': start
    }


def get_citations(cites, as_sdt=None, start=None):
    params = {
        "engine": "google_scholar",
        "cites": cites,
        "api_key": os.environ["SERP_API_KEY"]
    }
    if start is not None:
        params["start"] = start
    if as_sdt is not None:
        params["as_sdt"] = start
    search = GoogleSearch(params)
    results = search.get_dict()
    return results


def get_pdf_url_from_article(article_url):
    """Extract the PDF URL from a Google Scholar article page."""
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
            "(KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
        )
    }

    try:
        # Send a GET request to the article URL
        response = requests.get(article_url, headers=headers)

        # Check if the request was successful
        response.raise_for_status()

        # Parse the HTML content using BeautifulSoup
        soup = BeautifulSoup(response.content, "html.parser")
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
        return None
    except Exception as err:
        print(f"An error occurred: {err}")
        return None
    
    pdf_div = soup.find("div", {"class": "gsc_oci_title_ggi"})
    if pdf_div is None:
        return None
    
    return pdf_div.a["href"]


def get_author_info(scholar_id):
    params = {
    "engine": "google_scholar_author",
    "author_id": scholar_id,
    "api_key": os.environ["SERP_API_KEY"]
    }

    search = GoogleSearch(params)
    results = search.get_dict()

    return results


def extract_scholar_id(profile_url):
    # Use a regex to find the 'user' parameter in the URL
    match = re.search(r"user=([\w-]+)", profile_url)
    if match:
        scholar_id = match.group(1)
        return scholar_id
    else:
        print("Invalid Google Scholar profile URL.")
        return None


def process_google_scholar_profile():
    if os.path.exists(CACHE_PATH):
        with open(CACHE_PATH) as f:
            cache = json.load(f)
    else:
        cache = {}
    
    # Add data from GS profile
    if "profile_info" not in cache:
        profile_info = get_author_info(extract_scholar_id(GS_URL))
        cache["profile_info"] = profile_info
    
    # Add PDF link for each article
    if "article_pdf_links" not in cache:
        cache["article_pdf_links"] = {}
        for idx, article in enumerate(cache["profile_info"]["articles"]):
            pdf_url = get_pdf_url_from_article(article["link"])
            cache["article_pdf_links"][idx] = pdf_url

    # Fetch citing papers
    if "citing_papers" not in cache:
        cache["citing_papers"] = {}
        for idx, article in enumerate(cache["profile_info"]["articles"]):
            if article["cited_by"]["value"] == None:
                cache["citing_papers"][idx] = None
            else:
                cites_id = article["cited_by"]["cites_id"]
                citations = []
                citations.append(get_citations(cites_id))
                if "serpapi_pagination" in citations[-1]:
                    other_pages = citations[-1]["serpapi_pagination"]["other_pages"]
                    for page_id in sorted(other_pages.keys()):
                        params = extract_parameters(other_pages[page_id])
                        citations.append(get_citations(**params))
                cache["citing_papers"][idx] = citations
    
    # Fetch citing authors
    if "citing_authors" not in cache:
        cache["citing_authors"] = {}
        author_ids = set()
        for idx, article in cache["citing_papers"].items():
            if article is None:
                continue
            for page in article:
                for citation in page["organic_results"]:
                    if "authors" in citation["publication_info"]:
                        for author in citation["publication_info"]["authors"]:
                            author_ids.add(author["author_id"])
        
        print(f"Found {len(author_ids)} citing authors")

        for author_id in tqdm(author_ids):
            author_info = get_author_info(author_id)
            cache["citing_authors"][author_id] = author_info
    
    # Process affiliations of all citing authors
    if "citing_affiliations" not in cache:
        cache["citing_affiliations"] = {}
        affiliations = set([v["author"]["affiliations"] for k, v in cache["citing_authors"].items() if "error" not in v])
        client = Groq(
            api_key=os.environ.get("GROQ_API_KEY"),
        )
        for affiliation in affiliations:
            chat_completion = client.chat.completions.create(
                messages=[{"role": "user","content": AFFILIATION_EXTRACTION_PROMPT.format(affiliation)}],
                model="llama3-8b-8192",
            )
            cache["citing_affiliations"][affiliation] = chat_completion.choices[0].message.content

        new_affs = {}
        for k, v in cache["citing_affiliations"].items():
            try:
                elements = v.split(",")
                elements_merged = [elements[0].strip()]
                for elem in elements[1:]:
                    if ":" not in elem:
                        elements_merged[-1] += ", " + elem.strip()
                    else:
                        elements_merged.append(elem.strip())
                elements = elements_merged
                elements = [elem.split(":") for elem in elements]
                d = {k_elem.strip(): v_elem.strip() for k_elem, v_elem in elements}
                print(d)
            except Exception as e:
                print(v, "|||||||||||||||", e)
            new_affs[k] = {
                "orig": v,
                "parsed": d
            }
        
        cache["citing_affiliations"] = new_affs
    
    # Get coordinates for locations
    if "map_coordinates" not in cache:
        cache["map_coordinates"] = {}
        locations = []
        for k, v in cache["citing_affiliations"].items():
            info = v["parsed"]
            info = {kk.lower(): vv for kk, vv in info.items()}
            if "location" in info and info["location"] not in ["None", "None."]:
                locations.append(info["location"])
            elif "institution" in info and info["institution"] not in ["None", "None."]:
                locations.append(info["institution"])
        
        for location in locations:
            cache["map_coordinates"][location] = get_map_coordinates(location)
    
    # Plot locations on map
    plot_locations_on_map(cache["map_coordinates"])

    with open(CACHE_PATH, "w") as f:
        json.dump(cache, f)


if __name__ == "__main__":
    process_google_scholar_profile()