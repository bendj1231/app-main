import React, { useEffect } from 'react';

export const ProgramLogsEmbed = () => {
    useEffect(() => {
        const scriptId = "jotform-async";
        const existingScript = document.getElementById(scriptId);
        if (existingScript) existingScript.remove();

        const script = document.createElement("script");
        script.id = scriptId;
        script.src = "https://cdn.jotfor.ms/s/umd/latest/for-sheets-embed.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            const s = document.getElementById(scriptId);
            if (s) s.remove();
        };
    }, []);

    return (
        <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-slate-800">Program Logs</h2>
            <div className="relative bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-[500px]">
                <div
                    className="jotform-table-embed"
                    style={{ width: '100%', height: '600px' }}
                    data-id="260077773072055"
                    data-iframesource="www.jotform.com"
                    data-type="interactive"
                ></div>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white to-transparent pointer-events-none z-10"></div>
            </div>
        </div>
    );
};
