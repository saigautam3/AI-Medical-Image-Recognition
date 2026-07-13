import os
from PIL import Image
from dotenv import load_dotenv
from google import genai
from google.genai.errors import APIError
from flask import Flask, request, render_template
import markdown

# 1. Load variables from .env file FIRST
load_dotenv()

app = Flask(__name__)

# 2. Get API key cleanly
api_key_val = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=api_key_val)

# Free Tier Active Frontier Model
# MODEL_NAME = 'gemini-3.5-flash'
MODEL_NAME = 'gemini-3.1-flash-lite'

IMAGE_PROMPT = '''
You are analyzing an uploaded image for a medical description tool.

Step 1: On the first line, reply with exactly "VALID" if this image shows medical content
(e.g. an X-ray, scan, skin condition, wound, medication, or similar clinical subject),
or exactly "INVALID" if it does not (e.g. random photos, objects, people, screenshots unrelated to medicine).

Step 2: If and only if you replied "VALID", continue on the following lines with:
- A very detailed medical description of the image.
- Any relevant medical conditions, anomalies, or abnormalities present.
- Potential treatments or recommended actions based on the observed features.
- Ensure the content is accurate and clinically relevant. Do not provide false or misleading information.

If you replied "INVALID", do not add anything else after that line.
'''

def gen_image(prompt, image):
    """Sends optimized prompt + image payloads to the active Gemini endpoint."""
    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=[image, prompt]
        )
        return response.text
    except APIError as ae:
        if ae.code == 429:
            return "RATE_LIMIT_ERROR"
        # Pass the explicit Google message out to Flask
        return f"API_ERROR: {str(ae.message if hasattr(ae, 'message') else ae)}"
    except Exception as e:
        return f"API_ERROR: {str(e)}"

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        uploaded_file = request.files.get('file')
        if not uploaded_file or uploaded_file.filename == '':
            return render_template('index.html', response_text="Please choose an image file.")

        try:
            image = Image.open(uploaded_file)
            # Downsize locally to save Free Tier bandwidth
            image.thumbnail((800, 800))
        except Exception:
            return render_template('index.html', response_text="Could not read the uploaded file as an image.")

        raw = gen_image(IMAGE_PROMPT, image)

        if raw == "RATE_LIMIT_ERROR":
            return render_template(
                'index.html',
                response_text="Free tier rate-limit hit. Please wait 30 seconds and try submitting again."
            )
        
        if raw.startswith("API_ERROR"):
            error_details = raw.replace("API_ERROR:", "").strip()
            return render_template(
                'index.html', 
                response_text=f"AI Connection Error: {error_details}"
            )

        stripped = raw.strip()
        if stripped.upper().startswith("VALID"):
            # Clean up the output string, separating the "VALID" prefix tag
            parts = stripped.split("\n", 1)
            response_text = parts[1].strip() if len(parts) > 1 else stripped
            
            # CONVERT TO HTML HERE: Translates markdown dashes to clean bullet elements
            formatted_html = markdown.markdown(response_text)
            
            return render_template('index.html', response_text=formatted_html)
        else:
            return render_template('index.html', response_text="Please provide a valid medical image.")
        
    # This handles the initial page load (GET request) completely clean
    return render_template('index.html')


# def index():
#     if request.method == 'POST':
#         uploaded_file = request.files.get('file')
#         if not uploaded_file or uploaded_file.filename == '':
#             return render_template('index.html', response_text="Please choose an image file.")

#         try:
#             image = Image.open(uploaded_file)
#             # Downsize locally to save Free Tier bandwidth
#             image.thumbnail((800, 800))
#         except Exception:
#             return render_template('index.html', response_text="Could not read the uploaded file as an image.")

#         raw = gen_image(IMAGE_PROMPT, image)

#         if raw == "RATE_LIMIT_ERROR":
#             return render_template(
#                 'index.html',
#                 response_text="Free tier rate-limit hit. Please wait 30 seconds and try submitting again."
#             )
        
#         # HELP: Instead of showing a generic message, show the exact error text on screen
#         if raw.startswith("API_ERROR"):
#             error_details = raw.replace("API_ERROR:", "").strip()
#             return render_template(
#                 'index.html', 
#                 response_text=f"AI Connection Error: {error_details}"
#             )

#         stripped = raw.strip()
#         if stripped.upper().startswith("VALID"):
#             parts = stripped.split("\n", 1)
#             response_text = parts[1].strip() if len(parts) > 1 else stripped
#             return render_template('index.html', response_text=response_text)
#         else:
#             return render_template('index.html', response_text="Please provide a valid medical image.")

#     return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)

# import os
# from PIL import Image
# from dotenv import load_dotenv
# from google import genai
# from google.genai.errors import APIError
# from flask import Flask, request, render_template

# # 1. Load variables from .env file FIRST
# load_dotenv()

# app = Flask(__name__)

# # 2. Get API key cleanly
# api_key_val = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
# if not api_key_val:
#     print("⚠️ CRITICAL: No Google/Gemini API key discovered in .env!")

# client = genai.Client(api_key=api_key_val)

# # 3. FIX: Switch to the active, highest-allocation Free Tier model 
# MODEL_NAME = 'gemini-3.5-flash'

# IMAGE_PROMPT = '''
# You are analyzing an uploaded image for a medical description tool.

# Step 1: On the first line, reply with exactly "VALID" if this image shows medical content
# (e.g. an X-ray, scan, skin condition, wound, medication, or similar clinical subject),
# or exactly "INVALID" if it does not (e.g. random photos, objects, people, screenshots unrelated to medicine).

# Step 2: If and only if you replied "VALID", continue on the following lines with:
# - A very detailed medical description of the image.
# - Any relevant medical conditions, anomalies, or abnormalities present.
# - Potential treatments or recommended actions based on the observed features.
# - Ensure the content is accurate and clinically relevant. Do not provide false or misleading information.

# If you replied "INVALID", do not add anything else after that line.
# '''

# def gen_image(prompt, image):
#     """Sends optimized prompt + image payloads to the active Gemini endpoint."""
#     try:
#         response = client.models.generate_content(
#             model=MODEL_NAME,
#             contents=[image, prompt]
#         )
#         return response.text
#     except APIError as ae:
#         # Catch precise free tier request ceilings
#         if ae.code == 429:
#             print("⚠️ APP DIAGNOSTIC: Rate-limit ceiling crossed (429).")
#             return "RATE_LIMIT_ERROR"
#         print(f"❌ GOOGLE API ERROR: {ae}")
#         return f"API_ERROR: {str(ae)}"
#     except Exception as e:
#         print(f"❌ SYSTEM ERROR: {e}")
#         return f"API_ERROR: {str(e)}"

# @app.route('/', methods=['GET', 'POST'])
# def index():
#     if request.method == 'POST':
#         uploaded_file = request.files.get('file')
#         if not uploaded_file or uploaded_file.filename == '':
#             return render_template('index.html', response_text="Please choose an image file.")

#         try:
#             image = Image.open(uploaded_file)
            
#             # 4. OPTIMIZATION: Drastically reduce image token footprint to stop triggering 429s.
#             # Shifting a 12-megapixel photo to max 800px width/height preserves all text/details
#             # while consuming 90% fewer API tokens per click.
#             image.thumbnail((800, 800))
            
#         except Exception:
#             return render_template('index.html', response_text="Could not read the uploaded file as an image.")

#         raw = gen_image(IMAGE_PROMPT, image)

#         if raw == "RATE_LIMIT_ERROR":
#             return render_template(
#                 'index.html',
#                 response_text="Free tier rate-limit hit. Please wait 30 seconds and try submitting again."
#             )
        
#         if raw.startswith("API_ERROR"):
#             return render_template(
#                 'index.html', 
#                 response_text="An error occurred connecting to the medical AI service. Check terminal logs."
#             )

#         stripped = raw.strip()
#         if stripped.upper().startswith("VALID"):
#             parts = stripped.split("\n", 1)
#             response_text = parts[1].strip() if len(parts) > 1 else stripped
#             return render_template('index.html', response_text=response_text)
#         else:
#             return render_template('index.html', response_text="Please provide a valid medical image.")

#     return render_template('index.html')

# if __name__ == '__main__':
#     app.run(debug=True)