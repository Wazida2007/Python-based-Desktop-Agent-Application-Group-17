from pynput import mouse, keyboard
import time
import threading
import ctypes
import sys

# Constants
INACTIVITY_TIMEOUT = 30  # seconds

# Global variable to keep track of last activity time
last_activity_time = time.time()

# Define the callback functions
def on_move(x, y):
    global last_activity_time
    last_activity_time = time.time()
    print(f"Mouse moved to ({x}, {y})")

def on_click(x, y, button, pressed):
    global last_activity_time
    if pressed:
        last_activity_time = time.time()
        print(f"Mouse clicked at ({x}, {y}) with {button}")

def on_scroll(x, y, dx, dy):
    global last_activity_time
    last_activity_time = time.time()
    print(f"Mouse scrolled at ({x}, {y}) with delta ({dx}, {dy})")

def on_press(key):
    global last_activity_time
    last_activity_time = time.time()
    try:
        print(f"Key pressed: {key.char}")
    except AttributeError:
        print(f"Special key pressed: {key}")

def on_release(key):
    print(f"Key released: {key}")

def check_inactivity():
    global last_activity_time
    while True:
        current_time = time.time()
        if current_time - last_activity_time > INACTIVITY_TIMEOUT:
            ctypes.windll.user32.MessageBoxW(0, "You are not active", "Inactivity Warning", 0)
            last_activity_time = current_time  # Reset the timer to prevent multiple alerts
        time.sleep(1)

# Set up the mouse and keyboard listeners
mouse_listener = mouse.Listener(
    on_move=on_move,
    on_click=on_click,
    on_scroll=on_scroll
)

keyboard_listener = keyboard.Listener(
    on_press=on_press,
    on_release=on_release
)

# Start both listeners
mouse_listener.start()
keyboard_listener.start()

# Start the inactivity check in a separate thread
inactivity_thread = threading.Thread(target=check_inactivity, daemon=True)
inactivity_thread.start()

# Join both listeners to the main thread
mouse_listener.join()
keyboard_listener.join()
