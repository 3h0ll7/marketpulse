import { useEffect, useRef } from 'react';

interface TradingViewWidgetProps {
  widgetType: string;
  config: Record<string, unknown>;
  height?: string | number;
  fallbackMessage?: string;
}

export function TradingViewWidget({ widgetType, config, height = 400, fallbackMessage }: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear previous
    containerRef.current.innerHTML = '';

    try {
      const script = document.createElement('script');
      script.src = `https://s3.tradingview.com/external-embedding/embed-widget-${widgetType}.js`;
      script.type = 'text/javascript';
      script.async = true;
      script.innerHTML = JSON.stringify(config);
      
      const wrapper = document.createElement('div');
      wrapper.className = 'tradingview-widget-container__widget';
      containerRef.current.appendChild(wrapper);
      containerRef.current.appendChild(script);
      scriptRef.current = script;
    } catch {
      if (containerRef.current) {
        containerRef.current.innerHTML = `<div class="flex items-center justify-center h-full text-muted-foreground text-sm p-4">${fallbackMessage || 'Temporarily unavailable from source'}</div>`;
      }
    }

    return () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
      }
    };
  }, [widgetType, JSON.stringify(config)]);

  return (
    <div className="tradingview-widget-container" ref={containerRef} style={{ height: typeof height === 'number' ? `${height}px` : height, width: '100%' }} />
  );
}
