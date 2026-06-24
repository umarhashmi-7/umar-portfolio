import asyncio
from playwright.async_api import async_playwright

async def inspect():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto("http://localhost:5173/")
        await page.wait_for_timeout(1000)

        # 1. Click the "Technical Skills" tab to make it active and trigger reveal animations
        skills_tab_btn = page.locator(".super-tab-btn[data-super-tab='skills']")
        await skills_tab_btn.click()
        await page.wait_for_timeout(1000)

        # Measure heights on desktop
        print("=== DESKTOP LAYOUT (1280x800) ===")
        selectors = [
            "#panel-skills", 
            "#skills", 
            ".skill-radar-container", 
            ".skills-grid", 
            "#panel-brand-matrix", 
            "#brand-matrix", 
            "#what-i-bring", 
            ".bring-compact-grid"
        ]
        for selector in selectors:
            # use .first to handle elements with multiple instances
            el = page.locator(selector).first
            if await el.count() > 0:
                box = await el.bounding_box()
                if box:
                    print(f"{selector}: x={box['x']}, y={box['y']}, w={box['width']}, h={box['height']}")
                else:
                    print(f"{selector}: has element but no bounding box (hidden/display:none)")
            else:
                print(f"{selector}: not found")

        # 2. Resize to mobile
        print("\n=== MOBILE LAYOUT (375x812) ===")
        await page.set_viewport_size({"width": 375, "height": 812})
        await page.wait_for_timeout(1000)
        for selector in selectors:
            el = page.locator(selector).first
            if await el.count() > 0:
                box = await el.bounding_box()
                if box:
                    print(f"{selector}: x={box['x']}, y={box['y']}, w={box['width']}, h={box['height']}")
                else:
                    print(f"{selector}: has element but no bounding box (hidden/display:none)")
            else:
                print(f"{selector}: not found")

        await browser.close()

asyncio.run(inspect())
