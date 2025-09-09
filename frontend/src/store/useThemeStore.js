import React from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
        (set, get) => ({
            themes:{},
            
            theme: (() => {
                const saved = localStorage.getItem("dataTheme") || "light";
                document.documentElement.dataset.theme = saved; 
                return saved;
            })(),

            setTheme: (theme) => {
                localStorage.setItem("dataTheme", theme);
                document.documentElement.dataset.theme = theme;
                set({theme});
            },

            getAllThemes: () =>
            {
                const allThemes = {};
                for(const sheet of document.styleSheets)
                {
                    try
                    {
                        for(const rule of sheet.cssRules)
                        {
                            if(rule.selectorText?.startsWith('[data-theme="'))
                            {
                                const themeName = rule.selectorText.match(/\[data-theme="(.+?)"\]/)[1];
                                const vars = {};
                                for(let i=0; i<rule.style.length; i++)
                                {
                                    const prop = rule.style[i];
                                    if(prop.startsWith("--"))
                                    {
                                        vars[prop] = rule.style.getPropertyValue(prop).trim();
                                    }
                                }
                                allThemes[themeName] = vars;
                            }
                        }
                    }
                    catch(err){}
                    
                }set({ themes: allThemes });
            }

        }
    )
)