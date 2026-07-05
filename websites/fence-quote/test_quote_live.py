"""Interact with the LIVE fence-quote builder: click the button and capture the quote result."""
import sys
import os
import re
from playwright.sync_api import sync_playwright

LIVE_URL = "https://new-ashtabula-initiative.vercel.app/fence-quote/"
SCREENSHOTS_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    'sitemap_screenshots'
)
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 2400})
        page = context.new_page()
        
        # Navigate to live URL
        page.goto(LIVE_URL, wait_until="networkidle", timeout=15000)
        page.wait_for_timeout(1500)
        
        # BEFORE screenshot
        page.screenshot(path=os.path.join(SCREENSHOTS_DIR, "001_fence-quote-before.png"), full_page=True)
        print("Saved BEFORE screenshot")
        
        # Verify pre-filled values
        print(f"\n=== CHECKING PRE-FILLED VALUES ===")
        
        # Check slider value
        slider = page.query_selector("input[type=range]")
        if slider:
            slider_val = slider.get_attribute("value")
            print(f"Slider value: {slider_val}")
        else:
            print("No slider found")
        
        # Check which material is selected
        active_materials = page.query_selector_all(".material-btn.active")
        print(f"Active material buttons: {len(active_materials)}")
        for m in active_materials:
            text = m.text_content() or ""
            print(f"  Selected material: {text.strip()}")
        
        # Check which height is selected
        active_heights = page.query_selector_all(".height-btn.active")
        print(f"Active height buttons: {len(active_heights)}")
        for h in active_heights:
            text = h.text_content() or ""
            print(f"  Selected height: {text.strip()}")
        
        # Check linear feet display
        slider_text = page.query_selector(".slider-value")
        if slider_text:
            print(f"Linear feet display: {slider_text.text_content()}")
        
        # Also check page title / heading for demo context
        title = page.title()
        print(f"Page title: {title}")
        
        # Now click "Get Miller's Quote →" button
        print(f"\n=== CLICKING QUOTE BUTTON ===")
        
        # Try multiple strategies to find the button
        quote_btn = page.get_by_role("button", name="Get Miller")
        btn_count = quote_btn.count()
        print(f"get_by_role button count: {btn_count}")
        
        if btn_count == 0:
            quote_btn = page.get_by_text("Get Miller")
            btn_count = quote_btn.count()
            print(f"get_by_text button count: {btn_count}")
        
        if btn_count == 0:
            # List all buttons
            buttons = page.query_selector_all("button")
            print(f"All buttons found: {len(buttons)}")
            for b in buttons:
                txt = b.text_content() or ""
                if txt.strip():
                    print(f"  Button: '{txt.strip()[:100]}'")
                    
        if btn_count > 0:
            quote_btn.first.click()
            print("Clicked the quote button!")
            
            # Wait for result to appear
            import time
            time.sleep(3)
            
            try:
                page.wait_for_selector(".result-card, .alert, pre, .result-body", timeout=20000)
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
                    quote_text = pre.text_content() or ""
                    print(f"Quote text:\n{quote_text}")
                    
                    # Verify non-zero values in quote
                    numbers = re.findall(r'\$?[\d,]+(?:\.\d+)?', quote_text)
                    numeric_vals = [float(n.replace(',', '').replace('$', '')) for n in numbers if any(c.isdigit() for c in n)]
                    print(f"\nNumeric values found in quote: {numeric_vals}")
                    has_nonzero = any(v > 0 for v in numeric_vals)
                    print(f"Has non-zero values: {has_nonzero}")
                else:
                    card_text = result_card.text_content() or ""
                    print(f"Result card text: {card_text[:1000]}")
            else:
                alert = page.query_selector(".alert")
                if alert:
                    print(f"\nAlert shown: {alert.text_content()}")
                else:
                    print("\nNo result card or alert found")
                    # Get visible text for debugging
                    body_text = page.text_content("body") or ""
                    print(f"Body text length: {len(body_text)}")
                    # Check for any quote-related output
                    if "linear" in body_text.lower():
                        print("'linear' found in page content")
                    if "foot" in body_text.lower():
                        print("'foot' found in page content")
        else:
            print("Could not find quote button on live page")
        
        browser.close()
    
    print("\nDone.")

if __name__ == "__main__":
    main()
