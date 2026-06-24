import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        
        # Log page console
        page.on("console", lambda msg: print(f"Console: {msg.text}"))
        
        await page.goto("http://localhost:5173/")
        await page.wait_for_timeout(1000)
        
        # Print all .reveal elements
        reveals = await page.eval_on_selector_all(".reveal", "elements => elements.map(el => ({ id: el.id, className: el.className }))")
        print("--- All .reveal elements on load ---")
        for r in reveals:
            print(f"ID: '{r['id']}', Classes: '{r['className']}'")
            
        # Get coordinates of #what-i-bring
        box = await page.locator("#what-i-bring").bounding_box()
        print(f"\n#what-i-bring bounding box before click: {box}")
        
        # Switch to skills tab
        await page.click(".super-tab-btn[data-super-tab='skills']")
        await page.wait_for_timeout(500)
        
        box_after_click = await page.locator("#what-i-bring").bounding_box()
        print(f"#what-i-bring bounding box after click: {box_after_click}")
        
        # Let's scroll to the y coordinate of #what-i-bring
        if box_after_click:
            target_y = box_after_click['y'] + (box_after_click['height'] / 2)
            print(f"Scrolling to target_y: {target_y}")
            
        # Let's scroll step-by-step to the bottom of the page
        print("Scrolling step-by-step to bottom...")
        scroll_y = 0
        while True:
            scroll_y += 300
            await page.evaluate(f"window.scrollTo(0, {scroll_y})")
            await page.wait_for_timeout(100)
            
            # Check current max scroll height
            max_scroll = await page.evaluate("document.documentElement.scrollHeight - window.innerHeight")
            if scroll_y >= max_scroll:
                # Scroll to final bottom just in case
                await page.evaluate(f"window.scrollTo(0, {max_scroll})")
                await page.wait_for_timeout(500)
                break
            
            # Print all reveal elements bounding boxes
            print("\n--- Bounding boxes after scroll ---")
            scrollY = await page.evaluate("window.scrollY")
            scrollHeight = await page.evaluate("document.documentElement.scrollHeight")
            innerHeight = await page.evaluate("window.innerHeight")
            print(f"ScrollY: {scrollY}, ScrollHeight: {scrollHeight}, InnerHeight: {innerHeight}")
            elements = await page.eval_on_selector_all(".reveal", "elements => elements.map(el => ({ id: el.id, className: el.className, rect: el.getBoundingClientRect() }))")
            for el in elements:
                rect = el['rect']
                print(f"ID: '{el['id']}', Classes: '{el['className']}', rect: {{x: {rect['x']}, y: {rect['y']}, w: {rect['width']}, h: {rect['height']}}}")

            classes = await page.locator("#what-i-bring").evaluate("el => el.className")
            opacity = await page.locator("#what-i-bring").evaluate("el => window.getComputedStyle(el).opacity")
            print(f"\n#what-i-bring classes: '{classes}'")
            print(f"#what-i-bring computed opacity: {opacity}")
            
            grid_classes = await page.locator(".bring-compact-grid").evaluate("el => el.className")
            grid_opacity = await page.locator(".bring-compact-grid").evaluate("el => window.getComputedStyle(el).opacity")
            card_opacity = await page.locator(".bring-compact-grid .bring-compact-card").first.evaluate("el => window.getComputedStyle(el).opacity")
            print(f".bring-compact-grid classes: '{grid_classes}', opacity: {grid_opacity}")
            print(f"First bring-compact-card opacity: {card_opacity}")
            
        await browser.close()

asyncio.run(run())
