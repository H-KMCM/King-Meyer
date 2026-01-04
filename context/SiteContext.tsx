import React, { createContext, useContext, useState, useEffect } from 'react';

// Default Data
const defaultTheses = [
  {
    id: '1',
    title: "The Solvency Trap",
    description: "Why current eldercare models are mathematically guaranteed to fail—and how we fix them.",
    lead: true,
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    excerpt: "The confluence of demographic inversion, inflationary pressures on healthcare, and the structural limitations of public-private pension frameworks has created a systemic solvency trap. Current models, predicated on outdated actuarial assumptions from the late 20th century, fail to account for the dual realities of increased longevity and declining birth rates. This paper presents a non-linear mathematical model demonstrating that, without fundamental re-engineering, the global eldercare infrastructure faces a catastrophic collapse within the next two fiscal decades. Our analysis moves beyond superficial critiques of underfunding to expose the core architectural flaw: a dependency on speculative, market-correlated growth to finance long-tail, non-discretionary liabilities. We argue that the prevailing strategy—a patchwork of state subsidies and private insurance—is not merely insufficient; it is mathematically incoherent. The system is designed for a world that no longer exists. The first section of this thesis deconstructs the actuarial fallacies underpinning the current paradigm, using stress-test simulations based on volatility metrics observed between 2008 and 2024. We demonstrate a 92% probability of systemic default under moderate market downturn scenarios. The subsequent section outlines the King & Meyer alternative: a transition from a liability-driven model to an asset-backed, cash-flowing ecosystem. This involves the strategic acquisition and development of tangible assets—specifically, high-end, purpose-built residential care villages—that generate predictable, inflation-hedged revenue streams independent of public market volatility. We detail the financial architecture of these 'Legacy Assets,' including fixed-income components derived from occupancy contracts and the integration of proprietary preventative care protocols designed to reduce long-term medical costs. Our model proves that by internalizing the entire value chain, from real estate development to clinical service delivery, it is possible to create a self-sustaining system that offers superior returns to investors while providing a higher standard of care. This is not a social program; it is a rigorous, data-driven solution to a multi-trillion-dollar market inefficiency. The final part of this introduction presents a case study of our Vitae Monaco project, illustrating the practical application of our thesis. We provide preliminary data on operational cash flow, risk-adjusted returns, and key performance indicators related to resident health outcomes. The evidence points to a new class of institutional-grade assets capable of providing both capital preservation and significant alpha in an increasingly fragile global economy. We are not predicting a crisis; we are capitalizing on its inevitability."
  },
  {
    id: '2',
    title: "Cognitive ROI",
    description: "Quantifying the impact of neuro-optimisation on executive decision-making.",
    lead: false,
    imageUrl: "https://images.unsplash.com/photo-1581092921462-2052b6e3253b?q=80&w=1200&auto=format&fit=crop",
    excerpt: "Traditional financial models excel at quantifying market and operational risk, yet they possess a critical blind spot: the quantifiable impact of executive cognitive function on asset performance. 'Cognitive ROI' introduces a proprietary framework for measuring and optimizing the decision-making architecture of high-stakes leaders. This thesis posits that the most significant unpriced risk in any organization is the degradation of its leadership's cognitive capital under conditions of high stress, information overload, and chronic decision fatigue. We move beyond the qualitative metrics of leadership 'experience' and 'instinct' to develop a quantitative methodology for assessing neuro-performance. Our approach integrates clinical-grade diagnostics, including qEEG brain mapping and biometric stress marker analysis, with performance data to create a 'Cognitive Volatility Index' (CVI) for key executives. This index provides a leading indicator of potential strategic errors, operational lapses, and value-destructive behavior. The paper details the NEON (Neurodivergent Executive Optimisation Network) protocol, a system designed not to 'fix' but to weaponize the cognitive intensity of neurodivergent leaders, turning perceived liabilities like ADHD-driven hyper-focus into sustainable institutional assets. We present findings from a three-year longitudinal study involving C-suite executives from the technology and finance sectors. The data reveals a direct, quantifiable correlation between targeted neuro-optimisation interventions and improved capital allocation decisions, reduced operational errors, and an average 12% increase in alpha generation in trading environments. The study demonstrates that by creating a controlled ecosystem—balancing intense work cycles with structured cognitive recovery protocols—we can significantly enhance an executive's capacity for complex problem-solving and accurate risk assessment. This transforms human capital from a volatile, unpredictable variable into a managed, appreciating asset. The core of our argument is that in an economy increasingly driven by complex, data-intensive decisions, the marginal cognitive edge of a single leader can be the primary determinant of an organization's success or failure. This paper provides the analytical tools to measure that edge, enhance it, and ultimately, price it. The final section explores the implications for institutional investors and family offices, arguing that 'Cognitive ROI' analysis should become a mandatory component of due diligence for any significant direct investment. It represents the next frontier in risk management and alpha generation."
  },
  {
    id: '3',
    title: "The Liquidity Mandate",
    description: "Why capital preservation is the only viable 50-year strategy.",
    lead: false,
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200&auto=format&fit=crop",
    excerpt: "The dominant investment philosophy of the past four decades, built on the assumption of perpetual growth and stable globalization, is now obsolete. We are entering a new macroeconomic regime characterized by systemic fragility, geopolitical volatility, and the repricing of global supply chains. In this environment, the relentless pursuit of high-growth, speculative returns is not just risky; it is a structurally flawed strategy destined for catastrophic failure. 'The Liquidity Mandate' argues for a radical re-prioritization of institutional strategy: an unwavering focus on capital preservation and asset-backed durability. This thesis challenges the prevailing venture-capital model of 'blitzscaling' and exit-driven liquidity events, exposing it as a short-term gamble on monetary policy rather than a sustainable strategy for long-term value creation. Our analysis begins with a historical review of long-wave economic cycles, demonstrating that periods of systemic instability invariably reward entities that prioritize balance sheet strength and control of tangible, cash-flowing assets. We present a quantitative model that stress-tests a typical 'growth-oriented' portfolio against scenarios of sustained inflation, interest rate normalization, and deglobalization. The results indicate a 78% probability of permanent capital impairment over a 20-year horizon. The King & Meyer approach, by contrast, is architected for resilience. Our 'Quantitative Core'—a sophisticated engine of automated trading, fixed-income management, and active Treasury operations—serves as the foundation. Its primary directive is not to maximize upside but to eliminate downside risk and ensure absolute liquidity under all market conditions. This core provides the stable capital base from which we deploy into our strategic verticals: asset-backed, cash-flowing operations in non-correlated sectors like longevity and performance infrastructure. This paper details our 'barbell' strategy, where a hyper-conservative liquidity core is balanced by majority-control stakes in high-conviction, operationally intensive ventures. We do not speculate on technology; we build the enduring infrastructure that technology will eventually serve. The final section makes the case that for family offices and institutional allocators with multi-generational time horizons, the traditional 60/40 portfolio is no longer sufficient. The only viable 50-year strategy is one that treats liquidity not as a passive allocation but as an active, strategic mandate. In an era of unprecedented uncertainty, the ultimate alpha is the ability to endure. This thesis provides the blueprint for that endurance."
  }
];

const defaultSettings = {
  theme: {
    primary: '#0F172A', // Navy
    secondary: '#B45309', // Gold
  },
  slogan: 'High-Conviction Capital & Strategic Operations.',
  seo: {
    title: 'King & Meyer | Strategic Holding Core',
    description: 'A web application for King & Meyer, a strategic holding core and capital platform, showcasing their doctrine and operational philosophy with a private office aesthetic.',
    gaId: ''
  },
  theses: defaultTheses
};

const SiteContext = createContext(null);

// FIX: Add type for SiteProvider props to ensure `children` is correctly handled.
export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const savedSettings = localStorage.getItem('km-site-settings');
      return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    } catch (error) {
      return defaultSettings;
    }
  });

  useEffect(() => {
    localStorage.setItem('km-site-settings', JSON.stringify(settings));

    // Apply Theme
    document.documentElement.style.setProperty('--color-navy', settings.theme.primary);
    document.documentElement.style.setProperty('--color-gold', settings.theme.secondary);

    // Apply SEO
    document.title = settings.seo.title;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', settings.seo.description);

    // Apply GA Script
    const gaScriptId = 'ga-script';
    const gaScript = document.getElementById(gaScriptId);
    if (settings.seo.gaId) {
        if (!gaScript) {
            // FIX: Create a new script element with the correct type `HTMLScriptElement` to access properties like `async` and `src`.
            const newGaScript = document.createElement('script');
            newGaScript.id = gaScriptId;
            newGaScript.async = true;
            newGaScript.src = `https://www.googletagmanager.com/gtag/js?id=${settings.seo.gaId}`;
            document.head.appendChild(newGaScript);

            const dataLayerScript = document.createElement('script');
            dataLayerScript.innerHTML = `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${settings.seo.gaId}');
            `;
            document.head.appendChild(dataLayerScript);
        }
    } else {
        if (gaScript) {
            // A bit messy to remove all GA scripts, but good enough for this context
            Array.from(document.head.querySelectorAll('script')).forEach(s => {
                if(s.src.includes('googletagmanager') || s.innerHTML.includes('dataLayer')) {
                    s.remove();
                }
            })
        }
    }


  }, [settings]);

  const value = {
    ...settings,
    setTheme: (newTheme) => setSettings(s => ({ ...s, theme: { ...s.theme, ...newTheme } })),
    setSlogan: (newSlogan) => setSettings(s => ({ ...s, slogan: newSlogan })),
    setSeo: (newSeo) => setSettings(s => ({ ...s, seo: { ...s.seo, ...newSeo } })),
    setTheses: (newTheses) => setSettings(s => ({ ...s, theses: newTheses })),
  };

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
};