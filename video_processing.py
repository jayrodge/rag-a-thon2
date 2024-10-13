import os
import cv2
from io import BytesIO
from PIL import Image
import together
from llama_index.llms.together import TogetherLLM
from groq import Groq
from moviepy.editor import VideoFileClip
import tempfile
import base64

print("Starting video processing script...")

os.environ['GROQ_API_KEY'] = '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'
# Initialize clients
groq_client = Groq()
together.api_key = "336c0a4c5720db328215aacd007fccccfd51895d98e813f648473e79a9b1c99b"
print("Initialized API clients")

# Initialize LLM for text synthesis
llm = TogetherLLM(
    model="meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo", api_key=together.api_key
)
print("Initialized LLM for text synthesis")

def extract_frames(video_path, interval=30):
    print(f"Extracting frames from {video_path} at {interval} second intervals")
    frames = []
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_count = 0
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        if frame_count % int(fps * interval) == 0:
            frames.append(Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)))
            print(f"Extracted frame at {frame_count/fps:.2f} seconds")
        
        frame_count += 1
    
    cap.release()
    print(f"Extracted {len(frames)} frames in total")
    return frames

def analyze_frames(frames):
    print("Analyzing frames...")
    client = together.Together(api_key=together.api_key)
    descriptions = []
    
    for i, frame in enumerate(frames):
        print(f"Analyzing frame {i+1}/{len(frames)}")
        buffered = BytesIO()
        frame.save(buffered, format="JPEG")
        img_str = base64.b64encode(buffered.getvalue()).decode()
        
        response = client.chat.completions.create(
            model="meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "Describe this image in detail."},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{img_str}",
                            },
                        },
                    ],
                }
            ],
            max_tokens=300,
        )
        descriptions.append(response.choices[0].message.content)
    print("Frame analysis complete")
    return descriptions

def extract_audio(video_path):
    print(f"Extracting audio from {video_path}")
    video = VideoFileClip(video_path)
    audio = video.audio
    
    with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as temp_audio:
        audio.write_audiofile(temp_audio.name, codec='mp3')
        temp_audio_path = temp_audio.name
    
    video.close()
    print(f"Audio extracted to {temp_audio_path}")
    return temp_audio_path

def transcribe_audio(audio_path):
    print(f"Transcribing audio from {audio_path}")
    with open(audio_path, "rb") as file:
        transcription = groq_client.audio.transcriptions.create(
            file=(audio_path, file.read()),
            model="distil-whisper-large-v3-en",
            response_format="text",
            language="en",
            temperature=0.0
        )
    print("Audio transcription complete")
    return transcription

def synthesize_results(frame_descriptions, audio_transcription):
    print("Synthesizing results...")
    prompt = f"""
    Synthesize the following information from the first 5 minutes of a video:

    Visual content:
    {' '.join(frame_descriptions)}

    Audio content:
    {audio_transcription}

    Provide a comprehensive and detailed as posisble of the video content, incorporating both visual and audio information including time stamps if available.
    """
    
    response = llm.complete(prompt)
    print("Results synthesis complete")
    return response.text

def process_video(video_path):
    print(f"Processing video: {video_path}")
    # Extract and analyze frames
    frames = extract_frames(video_path)
    frame_descriptions = analyze_frames(frames)
    
    # Extract audio from video and transcribe
    temp_audio_path = extract_audio(video_path) #, max_duration=300)
    audio_transcription = transcribe_audio(temp_audio_path)
    
    # Clean up temporary audio file
    os.unlink(temp_audio_path)
    print(f"Removed temporary audio file: {temp_audio_path}")
    
    # Synthesize results
    summary = synthesize_results(frame_descriptions, audio_transcription)
    
    print("Video processing complete")
    return summary

# Usage
video_path = "/Users/jrodge/Downloads/videoplayback.mp4"
print(f"Starting video processing for: {video_path}")
result = process_video(video_path)
print("Final result:")
print(result)
