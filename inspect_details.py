import asyncio
from playwright.async_api import async_playwright

async def inspect():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        
        # Log console and page errors
        page.on("pageerror", lambda err: print(f"Page error: {err}"))
        page.on("console", lambda msg: print(f"Console: {msg.text}"))

        await page.goto("http://localhost:5173/")
        await page.wait_for_timeout(1000)

        # Click the Technical Skills tab
        await page.click(".super-tab-btn[data-super-tab='skills']")
        await page.wait_for_timeout(1000)

        print("=== Technical Skills Element Classes & Visibility ===")
        skills_grid = page.locator(".skills-grid").first
        classes = await skills_grid.evaluate("el => el.className")
        opacity = await skills_grid.evaluate("el => window.getComputedStyle(el).opacity")
        display = await skills_grid.evaluate("el => window.getComputedStyle(el).display")
        visibility = await skills_grid.evaluate("el => window.getComputedStyle(el).visibility")
        print(f".skills-grid classes: '{classes}'")
        print(f".skills-grid computed opacity: {opacity}, display: {display}, visibility: {visibility}")

        # Check first card
        first_card = page.locator(".skills-grid .skill-card").first
        if await first_card.count() > 0:
            c_opacity = await first_card.evaluate("el => window.getComputedStyle(el).opacity")
            c_display = await first_card.evaluate("el => window.getComputedStyle(el).display")
            print(f"First skill-card computed opacity: {c_opacity}, display: {c_display}")
            print(f"First skill-card text content: '{await first_card.inner_text()}'")
        else:
            print("No skill-card found under .skills-grid")

        # Scroll down gradually to y=5200 to trigger scroll reveal observers
        print("\n=== Scroll down gradually to y=5200 (#what-i-bring) ===")
        for y in range(0, 5300, 200):
            await page.evaluate(f"window.scrollTo(0, {y})")
            await page.wait_for_timeout(50)
        await page.wait_for_timeout(1500)

        bring_sec = page.locator("#what-i-bring").first
        sec_classes = await bring_sec.evaluate("el => el.className")
        print(f"#what-i-bring classes: '{sec_classes}'")

        bring_grid = page.locator(".bring-compact-grid").first
        b_classes = await bring_grid.evaluate("el => el.className")
        b_opacity = await bring_grid.evaluate("el => window.getComputedStyle(el).opacity")
        b_display = await bring_grid.evaluate("el => window.getComputedStyle(el).display")
        print(f".bring-compact-grid classes: '{b_classes}'")
        print(f".bring-compact-grid computed opacity: {b_opacity}, display: {b_display}")

        # Check first compact card
        first_bring_card = page.locator(".bring-compact-grid .bring-compact-card").first
        if await first_bring_card.count() > 0:
            bc_opacity = await first_bring_card.evaluate("el => window.getComputedStyle(el).opacity")
            bc_display = await first_bring_card.evaluate("el => window.getComputedStyle(el).display")
            print(f"First bring-compact-card computed opacity: {bc_opacity}, display: {bc_display}")
            print(f"First bring-compact-card text: '{await first_bring_card.inner_text()}'")
        else:
            print("No bring-compact-card found")

        await browser.close()

asyncio.run(inspect())
