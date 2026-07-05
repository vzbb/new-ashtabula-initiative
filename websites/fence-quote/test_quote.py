"""Interact with the fence-quote builder: click the button and capture the quote result."""
import sys
import os
import json
from playwright.sync_api import sync_playwright

DIST_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'dist')
SCREENSHOTS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'sitemap_screenshots')
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

def main():
    # Simple static server using Python
    import http.server
    import socketserver
    
    PORT = 0  # auto-select
    Handler = http.server.SimpleHTTPRequestHandler
    
    os.chdir(DIST_DIR)
    
    with socketserver.TCPServer(("127.0.0.1", 0), Handler) as httpd:
        port = httpd.server_address[1]
        print(f"Server on http://127.0.0.1:{port}")
        
        # Start server in a thread
        import threading
        server_thread = threading.Thread(target=httpd.serve_forever, daemon=True)
        server_thread.start()
        
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page(viewport={"width": 1280, "height": 2400})
            
            # Navigate
            page.goto(f"http://127.0.0.1:{port}/", wait_until="networkidle")
            page.wait_for_timeout(1000)
            
            # BEFORE screenshot
            page.screenshot(path=os.path.join(SCREENSHOTS_DIR, "001_fence-quote-before.png"), full_page=True)
            print("Saved BEFORE screenshot")
            
            # Verify pre-filled values
            body_text = page.text_content("body") or ""
            print(f"\n=== CHECKING PRE-FILLED VALUES ===")
            
            # Check slider value
            slider = page.query_selector("input[type=range]")
            if slider:
                slider_val = slider.get_attribute("value")
                print(f"Slider value: {slider_val}")
            
            # Check which material is selected
            active_materials = page.query_selector_all(".material-btn.active")
            print(f"Active material buttons: {len(active_materials)}")
            for m in active_materials:
                print(f"  Selected material: {m.text_content()}")
            
            # Check which height is selected
            active_heights = page.query_selector_all(".height-btn.active")
            print(f"Active height buttons: {len(active_heights)}")
            for h in active_heights:
                print(f"  Selected height: {h.text_content()}")
            
            # Check linear feet text
            slider_text = page.query_selector(".slider-value")
            if slider_text:
                print(f"Linear feet display: {slider_text.text_content()}")
            
            # Now click "Get Miller's Quote →" button
            print(f"\n=== CLICKING QUOTE BUTTON ===")
            quote_btn = page.get_by_text("Get Miller's Quote")
            btn_count = quote_btn.count()
            print(f"Found {btn_count} matching button(s)")
            
            if btn_count > 0:
                quote_btn.click()
                print("Clicked!")
                
                # Wait for result to appear
                import time
                time.sleep(2)
                
                # Try to wait for result elements
                try:
                    page.wait_for_selector(".result-card, .alert, pre, .result-body", timeout=15000)
                    print("Result element appeared!")
                except:
                    print("No result element appeared within timeout")
                
                page.wait_for_timeout(500)
                
                # AFTER screenshot
                page.screenshot(path=os.path.join(SCREENSHOTS_DIR, "001_fence-quote-after.png"), full_page=True)
                print("Saved AFTER screenshot")
                
                # Check for quote result
                result_card = page.query_selector(".result-card")
                if result_card:
                    print(f"\n=== QUOTE RESULT FOUND ===")
                    pre = page.query_selector("pre")
                    if pre:
                        quote_text = pre.text_content()
                        print(f"Quote text:\n{quote_text}")
                        
                        # Verify non-zero values in quote
                        import re
                        numbers = re.findall(r'\$?[\d,]+(?:\.\d+)?', quote_text)
                        numeric_vals = [float(n.replace(',', '').replace('$', '')) for n in numbers if any(c.isdigit() for c in n)]
                        print(f"\nNumeric values found in quote: {numeric_vals}")
                        has_nonzero = any(v > 0 for v in numeric_vals)
                        print(f"Has non-zero values: {has_nonzero}")
                    else:
                        print(f"Result card text: {result_card.text_content()}")
                else:
                    alert = page.query_selector(".alert")
                    if alert:
                        print(f"\nAlert shown: {alert.text_content()}")
                    else:
                        print("\nNo result card or alert found")
                        print(f"Page URL: {page.url}")
                        all_text = page.text_content("body") or ""
                        print(f"Page body (first 2000 chars): {all_text[:2000]}")
            else:
                print("Could not find button")
                # Try by role
                buttons = page.query_selector_all("button")
                print(f"All buttons on page ({len(buttons)}):")
                for b in buttons:
                    txt = b.text_content() or ""
                    if txt.strip():
                        print(f"  - {txt.strip()[:80]}")
            
            browser.close()
    
    print("\nDone.")

if __name__ == "__main__":
    main()
