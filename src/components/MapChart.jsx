import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { budgetData } from "../data/budgetData";

const MapChart = () => {
    const svgRef = useRef();
    const tooltipRef = useRef(null);

    // Data sample static untuk tooltip
    const provinceDetails = {
        "Kalimantan Timur": {
            activeProjects: 2,
            totalFunding: "+Rp.300 Juta",
            totalVolunteers: "+15.000",
            mostAction: true,
            logoUrl: "/logo.png",
        },
        "Aceh": {
            activeProjects: 4,
            totalFunding: "+Rp.1 Miliar",
            totalVolunteers: "+90.000",
            mostAction: true,
            logoUrl: "/logo.png",
        },
        "Sumatera Utara": {
            activeProjects: 5,
            totalFunding: "+Rp.2 Miliar",
            totalVolunteers: "+320.000",
            mostAction: true,
            logoUrl: "/logo.png",
        },
        "Sumatera Barat": {
            activeProjects: 6,
            totalFunding: "+Rp.3 Miliar",
            totalVolunteers: "+220.000",
            mostAction: true,
            logoUrl: "/logo.png",
        },

    };

    useEffect(() => {
        // Load SVG map
        fetch("/indonesia.svg")
            .then((response) => response.text())
            .then((svgText) => {
                d3.select(svgRef.current).html(svgText);


                const provinces = d3.selectAll("path");

                const budgets = budgetData.map((item) => item.budget);
                const minBudget = Math.min(...budgets);
                const maxBudget = Math.max(...budgets);
                const colorScale = d3
                    .scaleLinear()
                    .domain([minBudget, maxBudget])
                    .range(["#FF69B4", "#000000"]);


                provinces.each(function () {
                    const provinceName = this.id;
                    const provinceInfo = budgetData.find(
                        (item) => item.province === provinceName
                    );
                    if (provinceInfo) {
                        d3.select(this).style("fill", colorScale(provinceInfo.budget));
                    }
                });

                // Tooltip setup
                const tooltip = d3
                    .select("body")
                    .append("div")
                    .attr("class", "tooltip")
                    .style("position", "absolute")
                    .style("background", "white")
                    .style("padding", "10px")
                    .style("border", "1.5px solid #000")
                    .style("border-radius", "8px")
                    .style("opacity", 0)
                    .style("font-family", "Arial, sans-serif")
                    .style("box-shadow", "0 4px 6px rgba(0, 0, 0, 0.1)")
                    .style("transition", "opacity 0.2s ease-in-out");

                tooltipRef.current = tooltip.node();
                // Add hover effects
                provinces
                    .on("mouseover", function (event, d) {
                        const provinceName = this.id;
                        const provinceInfo = budgetData.find(
                            (item) => item.province === provinceName
                        );

                        if (provinceInfo) {
                            // Highlight the province by increasing its brightness
                            const originalColor = d3.select(this).style("fill");
                            const highlightedColor = d3.color(originalColor).brighter(0.2); // Increase brightness
                            d3.select(this).style("fill", highlightedColor);

                            // Show tooltip with detailed information
                            const details = provinceDetails[provinceName];
                            if (!details) return; // Skip if no details available for this province

                            const tooltipContent = `
                <div style="display: flex; flex-direction: column; gap: 8px;padding:10px">
                  <!-- Judul Provinsi -->
                  <p style="font-size: 16px; font-weight: bold; color: #000; margin: 0;padding-bottom:10px;">${provinceInfo.province.toUpperCase()}</p>

                  <!-- Kolom Utama -->
                  <div style="display: flex; justify-content: space-between; gap: 20px;">
                    <!-- Kolom Kiri -->
                    <div style="width: 45%;">
                      <p style="font-size: 10px; color: #000; margin: 0;">PROJECT AKTIF</p>
                      <h2 style="font-size: 18px; color: #000; margin: 0;padding-bottom:10px;">${details.activeProjects} Project</h2>
                      <p style="font-size: 10px; color: #000; margin: 0;">MOST ACTION</p>
                      ${details.mostAction
                                    ? '<div style="width: 100%; height: 8px; background-color: #8b0000;"></div>'
                                    : ""
                                }
                      <img src="${details.logoUrl}" alt="Logo" style="max-width: 120px; margin-top: 10px;padding-top:5px;" />
                    </div>

                    <!-- Kolom Kanan -->
                    <div style="width: 45%; padding-right:20px;padding-left:20px;">
                      <p style="font-size: 10px; color: #000; margin: 0;">TOTAL FUNDING</p>
                      <h2 style="font-size: 18px; color: #000; margin: 0;padding-bottom:10px;">${details.totalFunding}</h2>
                      <p style="font-size: 10px; color: #000; margin: 0;">TOTAL VOLUNTEER</p>
                      <div style="display: flex; align-items: center; gap: 2px;padding-bottom:5px;">
                        <h2 style="font-size: 18px; color: #000; margin: 0;">${details.totalVolunteers}</h2>
                        <span style="font-size: 11px; color: #000; margin: 0;">Orang</span>
                      </div>
                      <a
                        style="cursor: pointer;font-size: 12px;background: transparent; border: none; color: #ff69b4; font-weight: bold; text-decoration: underline; margin: 0; white-space: nowrap;"
                        onclick="window.location.href='https://example.com';"
                      >
                        SELENGKAPNYA →
                      </a>
                    </div>
                  </div>
                </div>
              `;
                            tooltip.html(tooltipContent);

                            // Position tooltip near the hovered province
                            const svgContainer = svgRef.current.getBoundingClientRect();
                            const tooltipWidth = tooltip.node().getBoundingClientRect().width;
                            const tooltipHeight = tooltip.node().getBoundingClientRect().height;

                            // Calculate position for tooltip near the hovered province
                            const mouseX = event.pageX;
                            const mouseY = event.pageY;

                            let left = mouseX + 10; // 10px padding
                            let top = mouseY + 10; // 10px padding

                            // Adjust position if tooltip goes out of bounds
                            if (left + tooltipWidth > window.innerWidth) {
                                left = mouseX - tooltipWidth - 10; // Move to the left side
                            }
                            if (top + tooltipHeight > window.innerHeight) {
                                top = mouseY - tooltipHeight - 10; // Move to the top side
                            }

                            tooltip
                                .style("left", `${left}px`)
                                .style("top", `${top}px`)
                                .style("opacity", 1);
                        }
                    })
                    .on("mouseout", function () {
                        // Tooltip tidak hilang saat mouse keluar
                    });

                // Hide tooltip when clicking outside
                d3.select(window).on("click", function (event) {
                    if (!tooltip.node().contains(event.target)) {
                        tooltip.style("opacity", 0);
                    }
                });
            });
    }, []);

    return (
        <div
            style={{
                justifyContent: "center",
                alignItems: "center",
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
            }}
        >
            {/* SVG yang responsif */}
            <svg
                ref={svgRef}
                style={{
                    width: "100%",
                    height: "auto",
                }}
                viewBox="0 0 800 600" // Sesuaikan dengan dimensi SVG asli
                preserveAspectRatio="xMidYMid meet"
            ></svg>
        </div>
    );
};

export default MapChart;