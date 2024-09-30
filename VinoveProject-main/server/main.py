import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from function.screenshot import capture_screenshot
from function.webTracker import track_usage
from database.db import get_detail
from model.model import TimerState, ScreenShotTime
from function.battery import get_battery_status 
import subprocess

timer_state = {"timerRunning": False}

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def on_startup():
    # Start the tracker.py script
    subprocess.Popen(["python", "function/tracker.py"], shell=True)

@app.get('/')
async def get_root():
    res = await get_detail()
    return res

@app.post('/screenshot')
async def read_screenshot(state: ScreenShotTime):
    import asyncio
    asyncio.create_task(capture_screenshot(state.time))
    return {"message": "Screenshot taken", "time": state.time}

# New screenshot function
async def screenshot(interval):
    import asyncio
    await capture_screenshot(interval)
    # Upload logic can be added here
    # For example, upload the screenshot to S3 or other cloud storage

@app.post('/screenshot-now')
async def take_screenshot_now():
    import asyncio
    interval = 0  # Immediate screenshot
    await screenshot(interval)
    return {"message": "Screenshot taken and uploaded."}

@app.post('/timer')
async def update_timer_state(state: TimerState):
    timer_state["timerRunning"] = state.timerRunning
    print(state.timerRunning)
    if state.timerRunning:
        # Run track_usage in the background
        import asyncio
        asyncio.create_task(track_usage())
    else:
        print("stop")
    return {"status": "success"}

@app.get('/timer')
async def employee_status():
    return {"timerRunning": timer_state["timerRunning"]}

@app.get('/battery_status')
async def battery_status():
    return get_battery_status()

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
