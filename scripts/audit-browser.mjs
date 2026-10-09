import {chromium} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
await mkdir('qa',{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900}});
for(const [name,url] of [['before','https://freelancer-six-mu.vercel.app/'],['lusion','https://lusion.co/'],['igloo','https://www.igloo.inc/']]){
 try{await page.goto(url,{waitUntil:'domcontentloaded',timeout:25000});await page.waitForTimeout(2500);await page.screenshot({path:`qa/${name}-desktop.png`});console.log(name,await page.title());if(name==='before'){for(const width of [768,390]){await page.setViewportSize({width,height:900});await page.screenshot({path:`qa/before-${width}.png`});}await page.setViewportSize({width:1440,height:900});}}
 catch(error){console.log(name,error.message.split('\n')[0]);}
}
await browser.close();
