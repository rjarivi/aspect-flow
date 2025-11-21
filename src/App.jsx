import React, { useState } from 'react';
import { Copy, ArrowRightLeft, Download, Check, MousePointerClick } from 'lucide-react';

const App = () => {
  const logoUrl = import.meta.env.BASE_URL + 'AspectFlow.svg';
  // State for Ratio and Dimensions
  const [ratioW, setRatioW] = useState(16);
  const [ratioH, setRatioH] = useState(9);
  const [pxW, setPxW] = useState(1920);
  const [pxH, setPxH] = useState(1080);
  
  // UI State
  
  const [copiedField, setCopiedField] = useState(null); // 'w' or 'h'
  const [isHoveringPreview, setIsHoveringPreview] = useState(false);

  // Calculate Dimensions based on Width anchor
  const calcHeight = (w, rW, rH) => Math.round(w / (rW / rH));
  // Calculate Dimensions based on Height anchor
  const calcWidth = (h, rW, rH) => Math.round(h * (rW / rH));

  // Handlers
  const handleRatioChange = (newW, newH) => {
    const w = Number(newW);
    const h = Number(newH);
    setRatioW(w);
    setRatioH(h);
    if (w && h && pxW) {
      setPxH(calcHeight(pxW, w, h));
    }
  };

  const handlePresetClick = (w, h) => {
    setRatioW(w);
    setRatioH(h);
    if (pxW) {
      setPxH(calcHeight(pxW, w, h));
    }
  };

  const handlePxWChange = (e) => {
    const val = Number(e.target.value);
    setPxW(val);
    if (val && ratioW && ratioH) {
      setPxH(calcHeight(val, ratioW, ratioH));
    }
  };

  const handlePxHChange = (e) => {
    const val = Number(e.target.value);
    setPxH(val);
    if (val && ratioW && ratioH) {
      setPxW(calcWidth(val, ratioW, ratioH));
    }
  };

  const handleSwap = () => {
    const oldRW = ratioW;
    setRatioW(ratioH);
    setRatioH(oldRW);
    
    const oldPxW = pxW;
    setPxW(pxH);
    setPxH(oldPxW);
    
  };

  const copyToClipboard = (val, field) => {
    navigator.clipboard.writeText(val);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // GENERATE & DOWNLOAD IMAGE
  const downloadPreview = () => {
    if (!pxW || !pxH) return;

    const canvas = document.createElement('canvas');
    canvas.width = pxW;
    canvas.height = pxH;
    const ctx = canvas.getContext('2d');

    // 1. Background Gradient
    const gradient = ctx.createLinearGradient(0, 0, pxW, pxH);
    gradient.addColorStop(0, '#5b21b6'); // violet-800
    gradient.addColorStop(1, '#7c3aed'); // violet-600
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, pxW, pxH);

    // 2. Visual Config
    const padding = Math.min(pxW, pxH) * 0.05; // 5% padding
    const lineWidth = Math.max(2, Math.min(pxW, pxH) * 0.005); // Responsive line weight
    const fontSize = Math.min(pxW, pxH) * 0.12; // Responsive font size
    const arrowSize = lineWidth * 6;

    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineWidth = lineWidth;
    ctx.fillStyle = 'white';
    ctx.font = `300 ${fontSize}px "Inter", sans-serif`;
    ctx.textBaseline = 'top';

    // 3. WIDTH INDICATOR (Top Edge)
    // Dashed Line
    ctx.beginPath();
    ctx.setLineDash([lineWidth * 4, lineWidth * 4]); // Dash pattern
    ctx.moveTo(padding, padding);
    ctx.lineTo(pxW - padding, padding);
    ctx.stroke();

    // Arrowhead (Right)
    ctx.setLineDash([]); // Solid for arrow
    ctx.beginPath();
    ctx.moveTo(pxW - padding - arrowSize, padding - (arrowSize * 0.6));
    ctx.lineTo(pxW - padding, padding);
    ctx.lineTo(pxW - padding - arrowSize, padding + (arrowSize * 0.6));
    ctx.stroke();

    // Origin Dot (Top Left)
    ctx.beginPath();
    ctx.arc(padding, padding, lineWidth * 2, 0, Math.PI * 2);
    ctx.fill();

    // Width Text
    ctx.textAlign = 'right';
    ctx.fillText(pxW, pxW - padding, padding + (lineWidth * 8));


    // 4. HEIGHT INDICATOR (Left Edge)
    // Dashed Line
    ctx.beginPath();
    ctx.setLineDash([lineWidth * 4, lineWidth * 4]);
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, pxH - padding);
    ctx.stroke();

    // Arrowhead (Bottom)
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(padding - (arrowSize * 0.6), pxH - padding - arrowSize);
    ctx.lineTo(padding, pxH - padding);
    ctx.lineTo(padding + (arrowSize * 0.6), pxH - padding - arrowSize);
    ctx.stroke();

    // Height Text (Rotated)
    ctx.save();
    ctx.translate(padding + (lineWidth * 8), pxH - padding);
    ctx.rotate(-Math.PI / 2); // Rotate -90deg
    ctx.textAlign = 'left'; 
    ctx.fillText(pxH, 0, 0);
    ctx.restore();

    // 5. Ratio Watermark (Center)
    ctx.font = `600 ${fontSize * 0.5}px "Inter", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillText(`${ratioW}:${ratioH}`, pxW/2, pxH/2);

    // Trigger Download
    const link = document.createElement('a');
    link.download = `Lumina-${pxW}x${pxH}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const presets = [
    { w: 16, h: 9, label: "16:9", sub: "Video" },
    { w: 9, h: 16, label: "9:16", sub: "Story" },
    { w: 4, h: 5, label: "4:5", sub: "IG Port" },
    { w: 1, h: 1, label: "1:1", sub: "Square" },
    { w: 4, h: 3, label: "4:3", sub: "Monitor" },
    { w: 3, h: 4, label: "3:4", sub: "Tablet" },
    { w: 3, h: 2, label: "3:2", sub: "DSLR" },
    { w: 2, h: 3, label: "2:3", sub: "Pinterest" },
    { w: 21, h: 9, label: "21:9", sub: "Cinema" },
    { w: 2, h: 1, label: "2:1", sub: "Mobile" },
    { w: 1, h: 2, label: "1:2", sub: "Split" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e5e5] font-sans flex items-center justify-center p-4 md:p-8 selection:bg-violet-500/30">
      
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-20" 
           style={{
             backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                               linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
             backgroundSize: '40px 40px'
           }}>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl bg-[#141414]/60 backdrop-blur-xl rounded-[24px] border border-white/5 shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Gradient Border Hint (Top Left) */}
        <div className="absolute top-0 left-0 w-full h-full rounded-[24px] pointer-events-none"
             style={{
               background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.4), transparent 40%)',
               opacity: 0.5,
               maskImage: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
               maskComposite: 'exclude',
               padding: '1px'
             }}>
        </div>

        {/* LEFT COLUMN: Controls */}
        <div className="flex-1 p-8 md:p-12 flex flex-col gap-10 z-20">
          
          {/* Header */}
          <div>
            <div className="flex items-center gap-3">
              <div className="relative h-9 w-9">
                <div className="absolute inset-0 rounded-lg bg-violet-500/30 blur-md scale-110" />
                <img
                  src={logoUrl}
                  alt="Aspect Flow"
                  className="relative z-10 h-9 w-9 rounded-lg p-1.5 object-contain"
                />
              </div>
              <h1 className="text-3xl text-white" style={{ fontFamily: '"Stack Sans Headline", sans-serif', fontWeight: 600 }}>
                Aspect <span className="text-violet-400 drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]">Flow</span>
              </h1>
            </div>
            <p className="text-neutral-500 text-sm mt-1">Professional dimension calculator</p>
          </div>

          {/* RATIO SECTION */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Aspect Ratio</label>
              <button onClick={handleSwap} className="text-neutral-500 hover:text-violet-400 transition-colors p-1" title="Swap Orientation">
                <ArrowRightLeft size={16} />
              </button>
            </div>
            
            <div className="flex gap-4 items-center">
              <div className="group relative flex-1 bg-white/[0.03] border border-white/10 focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-500/50 rounded-xl transition-all duration-300">
                <input 
                  type="number" 
                  value={ratioW} 
                  onChange={(e) => handleRatioChange(e.target.value, ratioH)}
                  className="w-full bg-transparent p-4 text-center text-xl font-mono outline-none placeholder-neutral-700"
                  placeholder="W"
                />
              </div>
              <span className="text-neutral-600 text-xl pb-1">:</span>
              <div className="group relative flex-1 bg-white/[0.03] border border-white/10 focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-500/50 rounded-xl transition-all duration-300">
                <input 
                  type="number" 
                  value={ratioH} 
                  onChange={(e) => handleRatioChange(ratioW, e.target.value)}
                  className="w-full bg-transparent p-4 text-center text-xl font-mono outline-none placeholder-neutral-700"
                  placeholder="H"
                />
              </div>
            </div>

            {/* PRESETS */}
            <div className="flex flex-wrap gap-2 mt-2">
              {presets.map((p) => (
                <button
                  key={p.label}
                  onClick={() => handlePresetClick(p.w, p.h)}
                  className={`px-3 py-2 rounded-lg text-xs border transition-all duration-200 flex items-center gap-2
                    ${ratioW === p.w && ratioH === p.h
                      ? 'bg-violet-600 border-violet-500 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]' 
                      : 'bg-white/[0.02] border-white/[0.05] text-neutral-400 hover:bg-white/[0.05] hover:border-white/10'
                    }`}
                >
                  <span className="font-semibold">{p.label}</span>
                  <span className={`opacity-50 ${ratioW === p.w && ratioH === p.h ? 'text-white' : 'text-neutral-600'}`}>{p.sub}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent w-full"></div>

          {/* DIMENSIONS SECTION */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Pixel Dimensions</label>
            
            <div className="flex gap-4">
              {/* Width Input */}
              <div className="flex-1">
                <div className="relative group bg-white/[0.03] border border-white/10 hover:border-white/20 focus-within:border-violet-500 rounded-xl transition-all duration-300 flex items-center pr-3">
                  <input 
                    type="number" 
                    value={pxW} 
                    onChange={handlePxWChange}
                    className="w-full bg-transparent p-4 text-lg font-mono outline-none text-white"
                  />
                  <span className="text-neutral-600 text-xs mr-2">px</span>
                  <button 
                    onClick={() => copyToClipboard(pxW, 'w')}
                    className="p-2 rounded-md hover:bg-white/10 text-neutral-500 hover:text-violet-400 transition-colors"
                    title="Copy Width"
                  >
                    {copiedField === 'w' ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                  </button>
                </div>
                <div className="text-xs text-neutral-500 mt-2 text-center">Width</div>
              </div>

              {/* Height Input */}
              <div className="flex-1">
                <div className="relative group bg-white/[0.03] border border-white/10 hover:border-white/20 focus-within:border-violet-500 rounded-xl transition-all duration-300 flex items-center pr-3">
                  <input 
                    type="number" 
                    value={pxH} 
                    onChange={handlePxHChange}
                    className="w-full bg-transparent p-4 text-lg font-mono outline-none text-white"
                  />
                  <span className="text-neutral-600 text-xs mr-2">px</span>
                  <button 
                    onClick={() => copyToClipboard(pxH, 'h')}
                    className="p-2 rounded-md hover:bg-white/10 text-neutral-500 hover:text-violet-400 transition-colors"
                    title="Copy Height"
                  >
                     {copiedField === 'h' ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                  </button>
                </div>
                <div className="text-xs text-neutral-500 mt-2 text-center">Height</div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Visual Preview */}
        <div className="flex-1 bg-black/20 relative border-l border-white/5 min-h-[400px] md:min-h-auto flex flex-col items-center justify-center overflow-hidden">
          
          {/* Dotted Background */}
          <div className="absolute inset-0 opacity-30" 
               style={{
                 backgroundImage: 'radial-gradient(#555 1px, transparent 1px)', 
                 backgroundSize: '24px 24px'
               }}>
          </div>

          {/* Shape Container */}
          <div className="relative z-10 w-full h-full p-12 flex items-center justify-center">
             <div 
              onClick={downloadPreview}
              onMouseEnter={() => setIsHoveringPreview(true)}
              onMouseLeave={() => setIsHoveringPreview(false)}
              className="relative rounded-lg shadow-[0_0_60px_rgba(124,58,237,0.2)] border border-white/10 transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] group cursor-pointer hover:scale-[1.02] hover:shadow-[0_0_80px_rgba(124,58,237,0.4)]"
              style={{
                aspectRatio: `${ratioW} / ${ratioH}`,
                // Logic to scale the box responsively without overflow
                width: ratioW >= ratioH ? '80%' : 'auto',
                height: ratioW < ratioH ? '60%' : 'auto',
                background: 'linear-gradient(135deg, rgba(76, 29, 149, 1) 0%, rgba(124, 58, 237, 0.8) 100%)'
              }}
             >
               {/* Hover Overlay with Dimensions & Download Action */}
               <div className={`absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-[3px] transition-opacity duration-300 rounded-lg ${isHoveringPreview ? 'opacity-100' : 'opacity-0'}`}>
                 
                 <div className="flex flex-col items-center gap-2 transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
                    <Download size={32} className="text-white mb-1 animate-bounce" />
                    <span className="text-white font-mono text-sm tracking-wider drop-shadow-md font-bold">
                        Download Image
                    </span>
                    <div className="h-px w-12 bg-white/30 my-1"></div>
                    <span className="text-white/80 font-mono text-xs">
                        {pxW} x {pxH}
                    </span>
                 </div>

               </div>
             </div>
          </div>

          <div className="absolute bottom-6 flex items-center gap-2 text-neutral-500 text-[10px] uppercase tracking-[0.2em] font-semibold">
            <MousePointerClick size={12} />
            Click Preview to Download
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;