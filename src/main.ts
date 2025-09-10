import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));


  // converte HEX in RGB
function hexToRgb(hex: string) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  const num = parseInt(hex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

// converte RGB in HEX
function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r,g,b].map(x => x.toString(16).padStart(2,'0')).join('');
}

// converte RGB in HSL
function rgbToHsl(r:number,g:number,b:number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h=0, s=0, l=(max+min)/2;

  if(max!==min){
    const d = max-min;
    s = l > 0.5 ? d/(2-max-min) : d/(max+min);
    switch(max){
      case r: h = (g-b)/d + (g<b?6:0); break;
      case g: h = (b-r)/d + 2; break;
      case b: h = (r-g)/d + 4; break;
    }
    h /= 6;
  }
  return {h,s,l};
}

// converte HSL in RGB
function hslToRgb(h:number,s:number,l:number) {
  let r=0,g=0,b=0;
  if(s===0){
    r=g=b=l;
  } else {
    const hue2rgb = (p:number,q:number,t:number) => {
      if(t<0) t+=1;
      if(t>1) t-=1;
      if(t<1/6) return p+(q-p)*6*t;
      if(t<1/2) return q;
      if(t<2/3) return p+(q-p)*(2/3-t)*6;
      return p;
    };
    const q = l<0.5 ? l*(1+s) : l+s-l*s;
    const p = 2*l-q;
    r=hue2rgb(p,q,h+1/3);
    g=hue2rgb(p,q,h);
    b=hue2rgb(p,q,h-1/3);
  }
  return {r:Math.round(r*255), g:Math.round(g*255), b:Math.round(b*255)};
}

function injectCssShades(color: string, name='color') {
  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb.r,rgb.g,rgb.b);
  const shades: Record<number,string> = {};
  let step = 0;

  while (step <= 1000) {
    let l = hsl.l;
    if(step<500){
      // schiarire
      l += (1 - l) * (1 - step/500); // aumenta luminosità fino a quasi 1
    } else if(step>500){
      // scurire
      l -= l * ((step-500)/500); // diminuisce luminosità verso 0
    }
    const rgbShade = hslToRgb(hsl.h,hsl.s,l);
    shades[step] = rgbToHex(rgbShade.r,rgbShade.g,rgbShade.b);
    step += 50;
  };

  // genera stringa CSS
  const css = Object.entries(shades)
    .map(([k,v]) => `  --${name}-${k}: ${v};`)
    .join('\n');

  // crea <style> e aggiungi al head
  const style = document.createElement('style');
  style.textContent = `:root {\n${css}\n}`;
  document.head.appendChild(style);
}

// esempio
injectCssShades('#64748b','gray');
injectCssShades('#ff3d32','red');
injectCssShades('#f97316','orange');
injectCssShades('#eab308','yellow');
injectCssShades('#22c55e','green');
injectCssShades('#14b8a6','teal');
injectCssShades('#06b6d4','cyan');
injectCssShades('#3b82f6','blue');
injectCssShades('#8183f4','indigo');
injectCssShades('#a855f7','purple');
injectCssShades('#ec4899','pink');