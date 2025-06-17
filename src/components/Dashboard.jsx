import React, { useEffect, useState } from "react";
import {
    VictoryChart,
    VictoryLine,
    VictoryBar,
    VictoryAxis,
    VictoryTheme,
    VictoryLegend,
    VictoryGroup,
    VictoryStack,
} from "victory";
import { Link } from "react-router-dom";

export default function Dashboard() {
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("http://localhost:4000/stats/summary");
                const json = await res.json();
                setSummary(json);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            }
        }
        fetchData();
    }, []);

    if (!summary) return <div style={styles.loading}>Loading dashboard data...</div>;

    return (
        <div style={styles.wrapper}>
            <Link to="/" style={styles.backButton}>🔙 Back to Game</Link>
            <h2 style={styles.heading}>🧭 Naval Command Dashboard</h2>

            <div style={styles.statBoxWrapper}>
                <StatBox label="Active Users" value={summary.activeUsers?.slice(-1)[0]?.count || 0} />
                <StatBox label="Success Rolls" value={summary.successTotal} />
                <StatBox label="Failed Rolls" value={summary.failureTotal} />
                <StatBox label="Total Wagered" value={`$${summary.totalWagered?.toFixed(2)}`} />
                <StatBox label="Total Profit" value={`$${summary.profit?.reduce((a, b) => a + b.amount, 0).toFixed(2) || 0}`} />
                <StatBox label="RTP 10min" value={`${summary.rtp["10min"].at(-1)?.value.toFixed(2)}%`} />
                <StatBox label="RTP 1hr" value={`${summary.rtp["1hr"].at(-1)?.value.toFixed(2)}%`} />
                <StatBox label="RTP 24hr" value={`${summary.rtp["24hr"].at(-1)?.value.toFixed(2)}%`} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 32 }}>
                <ChartSection title="👥 Active Users">
                    <VictoryChart theme={VictoryTheme.material} height={200}>
                        <VictoryLegend x={100} y={0} orientation="horizontal" data={[{ name: "Users", symbol: { fill: "#00ffff" } }]} />
                        <VictoryAxis fixLabelOverlap />
                        <VictoryAxis dependentAxis />
                        <VictoryLine data={summary.activeUsers} x="time" y="count" style={{ data: { stroke: "#00ffff" } }} />
                    </VictoryChart>
                </ChartSection>

                <ChartSection title="🎯 RTP - Return to Player">
                    <VictoryChart theme={VictoryTheme.material} height={200}>
                        <VictoryLegend x={100} y={0} orientation="horizontal" data={[
                            { name: "10min", symbol: { fill: "#00ff00" } },
                            { name: "1hr", symbol: { fill: "#ffaa00" } },
                            { name: "24hr", symbol: { fill: "#ff00ff" } },
                        ]} />
                        <VictoryAxis fixLabelOverlap />
                        <VictoryAxis dependentAxis domain={[0, 1200]} />
                        <VictoryLine data={summary.rtp["10min"]} x="time" y="value" style={{ data: { stroke: "#00ff00" } }} />
                        <VictoryLine data={summary.rtp["1hr"]} x="time" y="value" style={{ data: { stroke: "#ffaa00" } }} />
                        <VictoryLine data={summary.rtp["24hr"]} x="time" y="value" style={{ data: { stroke: "#ff00ff" } }} />
                    </VictoryChart>
                </ChartSection>

                <ChartSection title="💰 Amount Wagered & Profit">
                    <VictoryChart theme={VictoryTheme.material} height={200}>
                        <VictoryLegend x={100} y={0} orientation="horizontal" data={[
                            { name: "Wagered", symbol: { fill: "#00ffff" } },
                            { name: "Profit", symbol: { fill: "#ff00ff" } },
                        ]} />
                        <VictoryAxis fixLabelOverlap />
                        <VictoryAxis dependentAxis />
                        <VictoryLine data={summary.wagered} x="time" y="amount" style={{ data: { stroke: "#00ffff" } }} />
                        <VictoryLine data={summary.profit} x="time" y="amount" style={{ data: { stroke: "#ff00ff" } }} />
                    </VictoryChart>
                </ChartSection>
            </div>
        </div>
    );
}

const ChartSection = ({ title, children }) => (
    <div style={{ marginBottom: 40 }}>
        <h3 style={{ textAlign: "center", marginBottom: 12 }}>{title}</h3>
        {children}
    </div>
);

const StatBox = ({ label, value }) => (
    <div style={styles.statBox}>
        <div style={styles.statLabel}>{label}</div>
        <div style={styles.statValue}>{value}</div>
    </div>
);

const styles = {
    wrapper: {
        minHeight: "100vh",
        overflowY: "auto",
        backgroundColor: "#000d1a",
        color: "#00ffff",
        padding: "20px 12px 60px",
        boxSizing: "border-box",
    },
    heading: {
        textAlign: "center",
        marginBottom: 20,
        fontSize: "28px",
    },
    statBoxWrapper: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "16px",
        marginBottom: "32px",
    },
    statBox: {
        background: "#0e1a26",
        border: "1px solid #00ffff",
        padding: "12px 16px",
        borderRadius: "8px",
        minWidth: "150px",
        textAlign: "center",
        boxShadow: "0 0 8px #00ffff44",
    },
    statLabel: {
        fontSize: "14px",
        color: "#00ccff",
    },
    statValue: {
        fontSize: "20px",
        fontWeight: "bold",
        color: "#ffffff",
    },
    backButton: {
        position: "fixed",
        top: 12,
        right: 12,
        padding: "10px 16px",
        backgroundColor: "#1a1a1a",
        color: "#00ffff",
        fontWeight: "bold",
        fontSize: "14px",
        borderRadius: "8px",
        border: "2px solid #00ffff",
        textDecoration: "none",
        boxShadow: "0 0 12px #00ffff, inset 0 0 4px #00ffff",
        zIndex: 9999,
        transition: "all 0.2s ease-in-out",
    },
    loading: {
        padding: 40,
        fontSize: 20,
        color: "#00ffff",
        textAlign: "center",
    },
};
