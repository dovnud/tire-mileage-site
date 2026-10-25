#!/usr/bin/env python3
"""Desktop + mobile screenshots of key pages from a local static server of dist/. Usage: python3 scripts/screenshots.py"""
import subprocess, time, sys, os, socket
from playwright.sync_api import sync_playwright
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.makedirs(f'{ROOT}/screenshots',exist_ok=True)
PAGES=[('home','/'),('line-michelin-defender-2','/tires/michelin/defender-2/'),('line-continental-procontact-tx','/tires/continental/procontact-tx/'),('size-225-65r17','/sizes/225-65r17/'),('brand-michelin','/tires/michelin/')]
_s=socket.socket(); _s.bind(('127.0.0.1',0)); PORT=_s.getsockname()[1]; _s.close()
srv=subprocess.Popen([sys.executable,'-m','http.server',str(PORT),'-d',f'{ROOT}/dist','--bind','127.0.0.1'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
time.sleep(1)
try:
  with sync_playwright() as p:
    b=p.chromium.launch()
    for tag,vp,scheme in [('desktop',{'width':1280,'height':800},'light'),('mobile',{'width':390,'height':844},'light'),('desktop-dark',{'width':1280,'height':800},'dark')]:
      ctx=b.new_context(viewport=vp,color_scheme=scheme,device_scale_factor=1 if tag!='mobile' else 2,is_mobile=tag=='mobile')
      for name,path in PAGES:
        if tag=='desktop-dark' and name not in ('home','line-michelin-defender-2'): continue
        pg=ctx.new_page(); pg.goto(f'http://127.0.0.1:{PORT}'+path,wait_until='networkidle'); pg.wait_for_timeout(300); assert 'TireMileage' in pg.content(), path
        pg.screenshot(path=f'{ROOT}/screenshots/{name}-{tag}.png',full_page=True); pg.close()
      ctx.close()
    b.close()
finally:
  srv.terminate()
