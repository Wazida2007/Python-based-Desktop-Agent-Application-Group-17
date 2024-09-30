import asyncio
import pyautogui
import datetime
import io
import base64
import json
import os
import aiohttp
from pymongo import MongoClient
from PIL import Image

# MongoDB connection settings
MONGO_URI = 'mongodb://localhost:27017/'
DATABASE_NAME = 'screenshot_db'
COLLECTION_NAME = 'screenshots'

# Local queue directory
QUEUE_DIR = 'image_queue'
LAMBDA_URL = "https://xaaezpqn9b.execute-api.us-east-1.amazonaws.com/prod/upload"

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]
collection = db[COLLECTION_NAME]

async def save_screenshot_to_mongodb(image_bytes: io.BytesIO):
    """Save the image to MongoDB."""
    document = {
        "timestamp": datetime.datetime.now(),
        "image": image_bytes.getvalue()
    }
    result = collection.insert_one(document)
    return result.inserted_id

async def invoke_lambda(image_bytes: io.BytesIO):
    """Invoke the Lambda function to upload the image to S3."""
    image_base64 = base64.b64encode(image_bytes.getvalue()).decode('utf-8')
    payload = {
        "image_data": image_base64,
        "timestamp": datetime.datetime.now().isoformat()
    }

    async with aiohttp.ClientSession() as session:
        try:
            async with session.post(LAMBDA_URL, json=payload) as response:
                if response.status == 200:
                    print("Image successfully uploaded to S3 via Lambda")
                else:
                    print(f"Failed to upload image to S3 via Lambda: {await response.text()}")
        except Exception as e:
            print(f"An error occurred: {e}")

async def queue_image(image_bytes: io.BytesIO, image_name: str):
    """Queue the image by saving it to a local directory."""
    if not os.path.exists(QUEUE_DIR):
        os.makedirs(QUEUE_DIR)

    image_path = os.path.join(QUEUE_DIR, image_name)
    with open(image_path, 'wb') as file:
        file.write(image_bytes.getvalue())
    print(f"Image saved to local queue at {image_path}")

async def sync_images():
    """Sync images from the local queue to the server."""
    if await is_online():
        for image_name in os.listdir(QUEUE_DIR):
            image_path = os.path.join(QUEUE_DIR, image_name)
            try:
                with open(image_path, 'rb') as file:
                    img_bytes = io.BytesIO(file.read())
                    await invoke_lambda(img_bytes)
                os.remove(image_path)
                print(f"Removed {image_path} after successful upload")
            except Exception as e:
                print(f"Failed to process {image_path}: {e}")

async def is_online():
    """Check if the network is online."""
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get("https://www.google.com") as response:
                return response.status == 200
    except Exception:
        return False

async def capture_screenshot(interval: int):
    while True:
        now = datetime.datetime.now()
        print(f"Taking screenshot at {now}")
        await asyncio.sleep(interval)

        # Take screenshot using pyautogui
        image = pyautogui.screenshot()

        # Save the screenshot to an in-memory bytes buffer
        img_bytes = io.BytesIO()
        image.save(img_bytes, format='PNG')
        img_bytes.seek(0)

        # Determine image name
        image_name = f"screenshot_{now.strftime('%Y%m%d_%H%M%S')}.png"

        # Save the screenshot to MongoDB or queue locally
        if await is_online():
            try:
                screenshot_id = await save_screenshot_to_mongodb(img_bytes)
                print(f"Screenshot saved to MongoDB with ID: {screenshot_id}")
                await invoke_lambda(img_bytes)
            except Exception as e:
                print(f"Failed to process image: {e}")
                await queue_image(img_bytes, image_name)
        else:
            await queue_image(img_bytes, image_name)

async def main():
    interval = 60  # Screenshot interval in seconds
    # Start the screenshot capturing loop
    screenshot_task = asyncio.create_task(capture_screenshot(interval))
    
    # Start the sync loop
    while True:
        await asyncio.sleep(30)  # Check for network and sync every 30 seconds
        await sync_images()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Screenshot capturing stopped.")
    finally:
        # Clean up MongoDB connection
        client.close()
