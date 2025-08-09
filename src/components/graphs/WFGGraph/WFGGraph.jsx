import React, { useEffect, useRef, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { api } from '../../../api/client';
import './WFGGraph.css';

const WFGGraph = () => {
  const ref = useRef();
  const [data, setData] = useState({ nodes: [], links: [], cycle: { nodes: [], edges: [] } });

  const load = async () => {
    const d = await api.wfg();
    setData({
      nodes: d.nodes.map(n => ({ id: n.id, cycle: (d.cycle?.nodes || []).includes(n.id) })),
      links: d.edges.map(e => ({ source: e.source, target: e.target, resource: e.resource,
        inCycle: (d.cycle?.edges || []).some(c => c.source === e.source && c.target === e.target)
      })),
      cycle: d.cycle || { nodes: [], edges: [] }
    });
  };

  useEffect(() => {
    const t = setInterval(load, 800);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="panel wfg-graph">
      <h2>Wait-For Graph</h2>
      <ForceGraph2D
        ref={ref}
        width={600}
        height={420}
        graphData={{ nodes: data.nodes, links: data.links }}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.id;
          const fontSize = 12 / globalScale;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.cycle ? 9 : 7, 0, 2*Math.PI, false);
          ctx.fillStyle = node.cycle ? 'rgba(255,0,0,0.6)' : 'rgba(0,0,0,0.7)';
          ctx.fill();
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillStyle = 'black';
          ctx.fillText(label, node.x, node.y + 8);
        }}
        linkDirectionalArrowLength={6}
        linkDirectionalParticles={0}
        linkCanvasObjectMode={() => 'after'}
        linkCanvasObject={(link, ctx) => {
          const midX = (link.source.x + link.target.x) / 2;
          const midY = (link.source.y + link.target.y) / 2;
          const label = link.resource || '';
          ctx.font = '10px Sans-Serif';
          ctx.fillStyle = link.inCycle ? 'red' : 'gray';
          ctx.fillText(label, midX, midY);
        }}
      />
    </section>
  );
};

export default WFGGraph;
