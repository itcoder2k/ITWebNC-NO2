import React, { useState } from 'react';

export default function InteractiveDemo() {
  const [activeTab, setActiveTab] = useState('json'); // 'json' | 'unity' | 'godot'
  const [copied, setCopied] = useState(false);
  const [activePreset, setActivePreset] = useState('knight'); // 'knight' | 'shield'
  const [animationState, setAnimationState] = useState('idle'); // 'idle' | 'attack'

  const snippets = {
    json: `{
  "asset_name": "${activePreset === 'knight' ? 'Pixel_Hero_Knight_2D' : 'Retro_RPG_Shield_3D'}",
  "category": "${activePreset === 'knight' ? '2D Spritesheets' : '3D Low-Poly Models'}",
  "format": ${activePreset === 'knight' ? '["PNG", "JSON Atlas"]' : '["FBX", "GLTF 2.0", "OBJ"]'},
  "license": "CC-BY 4.0 / Commercial Allowed",
  "pwyw_pricing": {
    "min_price": 0,
    "suggested_price": 25000,
    "allow_tip": true
  }
}`,
    unity: `// Unity Engine C# Script
using UnityEngine;

public class GameAssetLoader : MonoBehaviour {
    [SerializeField] private TextAsset assetConfig;
    
    void Start() {
        Debug.Log("Loading ${activePreset === 'knight' ? 'Pixel Knight' : 'RPG Shield'} into Unity...");
        // Auto-configure Sprite Atlas & PBR Materials
    }
}`,
    godot: `# Godot 4.x GDScript
extends CharacterBody2D

const ASSET_NAME = "${activePreset === 'knight' ? 'Pixel_Hero_Knight' : 'Retro_Shield'}"

func _ready():
    print("Initializing asset in Godot Engine...")
    $AnimationPlayer.play("${animationState}")
`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTriggerAction = () => {
    setAnimationState(animationState === 'idle' ? 'attack' : 'idle');
  };

  return (
    <section 
      id="demo-preview" 
      className="py-5 position-relative" 
      style={{ 
        backgroundColor: 'var(--bg-body)', 
        borderTop: '1px solid var(--border-color)',
        transition: 'background-color 0.25s ease'
      }}
    >
      <div className="container py-3">
        
        {/* Section title */}
        <div className="text-center mb-5">
          <span className="badge rounded-pill bg-info-subtle text-info border border-info-subtle px-3 py-1 mb-2 fw-semibold">
            <i className="bi bi-code-slash me-1"></i> Trải Nghiệm Tương Tác Trực Tiếp
          </span>
          <h2 className="fw-bolder mb-2" style={{ fontSize: '32px', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Tích Hợp Dễ Dàng Vào Mọi Game Engine
          </h2>
          <p className="small mb-0" style={{ maxWidth: '640px', margin: '0 auto', fontSize: '15.5px', color: 'var(--text-muted)' }}>
            Mỗi gói tài nguyên trên sàn đều đi kèm tệp manifest chuẩn hóa, sẵn sàng kéo thả ngay vào Unity, Godot hay Unreal Engine.
          </p>
        </div>

        {/* Mockup Container */}
        <div className="rn-mockup-wrapper">
          
          {/* Bộ chọn Mẫu Demo (Preset Switcher) */}
          <div className="d-flex justify-content-center align-items-center gap-2 mb-4 flex-wrap">
            <span className="small fw-bold text-muted me-2">Chọn mẫu thử:</span>
            <button 
              className={`btn btn-sm rounded-pill px-3.5 fw-semibold ${activePreset === 'knight' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setActivePreset('knight')}
            >
              ⚔️ 2D Pixel Knight
            </button>
            <button 
              className={`btn btn-sm rounded-pill px-3.5 fw-semibold ${activePreset === 'shield' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setActivePreset('shield')}
            >
              🛡️ 3D Fantasy Shield
            </button>
          </div>

          <div className="row align-items-center g-4">
            
            {/* Left: Code Box with Tabs */}
            <div className="col-12 col-lg-7">
              <div className="rn-code-box">
                {/* Tabs Header */}
                <div className="d-flex align-items-center justify-content-between border-bottom" style={{ borderColor: 'var(--border-color)', background: 'var(--card-header-bg)' }}>
                  <div className="d-flex">
                    <button 
                      className={`rn-code-tab ${activeTab === 'json' ? 'is-active' : ''}`}
                      onClick={() => setActiveTab('json')}
                    >
                      <i className="bi bi-filetype-json me-1 text-warning"></i> asset_config.json
                    </button>
                    <button 
                      className={`rn-code-tab ${activeTab === 'unity' ? 'is-active' : ''}`}
                      onClick={() => setActiveTab('unity')}
                    >
                      <i className="bi bi-unity me-1 text-info"></i> Unity C#
                    </button>
                    <button 
                      className={`rn-code-tab ${activeTab === 'godot' ? 'is-active' : ''}`}
                      onClick={() => setActiveTab('godot')}
                    >
                      <i className="bi bi-robot me-1 text-primary"></i> Godot Script
                    </button>
                  </div>
                  <button 
                    onClick={handleCopy} 
                    className="btn btn-sm text-muted me-2 py-1 px-2.5 d-inline-flex align-items-center gap-1"
                    style={{ fontSize: '12px' }}
                    title="Sao chép mã nguồn"
                  >
                    <i className={`bi ${copied ? 'bi-check-lg text-success' : 'bi-clipboard'}`}></i>
                    <span>{copied ? 'Đã chép!' : 'Sao chép'}</span>
                  </button>
                </div>

                {/* Code Content */}
                <pre 
                  className="p-4 mb-0" 
                  style={{ 
                    fontSize: '13.5px', 
                    lineHeight: '1.65', 
                    color: 'var(--text-main)', 
                    backgroundColor: 'var(--card-bg)', 
                    overflowX: 'auto',
                    minHeight: '260px'
                  }}
                >
                  {snippets[activeTab]}
                </pre>
              </div>
            </div>

            {/* Right: Interactive Device Mockup */}
            <div className="col-12 col-lg-5">
              <div className="d-flex justify-content-center">
                
                <div className="rn-phone-mockup">
                  {/* Dynamic Island / Speaker */}
                  <div className="d-flex justify-content-center pt-2">
                    <div style={{ width: '45px', height: '10px', borderRadius: '10px', background: 'var(--phone-border)' }}></div>
                  </div>

                  {/* Phone Screen interactive content */}
                  <div className="p-3 text-center d-flex flex-column justify-content-between flex-grow-1">
                    
                    <div className="pt-2">
                      <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2.5 py-1 mb-2" style={{ fontSize: '10px' }}>
                        ● 60 FPS • Real-time Demo
                      </span>
                      <h6 className="fw-bold mb-0" style={{ fontSize: '15px', color: 'var(--text-main)' }}>
                        {activePreset === 'knight' ? 'Pixel Hero Knight' : 'Fantasy RPG Shield'}
                      </h6>
                      <span className="small text-muted" style={{ fontSize: '11px' }}>
                        Trạng thái: <span className="text-info fw-bold">{animationState.toUpperCase()}</span>
                      </span>
                    </div>

                    {/* Animated Character / Item Visual */}
                    <div className="py-3 position-relative">
                      <div 
                        className="d-inline-block transition-all"
                        style={{ 
                          fontSize: '64px',
                          transform: animationState === 'attack' ? 'scale(1.25) rotate(15deg)' : 'scale(1)',
                          transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                          filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.15))'
                        }}
                      >
                        {activePreset === 'knight' ? (animationState === 'attack' ? '🗡️' : '⚔️') : '🛡️'}
                      </div>
                      {animationState === 'attack' && (
                        <div className="position-absolute top-50 start-50 translate-middle text-warning fw-bold fs-4" style={{ pointerEvents: 'none' }}>
                          💥 CRIT!
                        </div>
                      )}
                    </div>

                    {/* Interactive Action Controls */}
                    <div className="pb-2">
                      <button 
                        onClick={handleTriggerAction}
                        className="btn btn-sm btn-primary rounded-pill w-100 py-1.5 shadow-sm fw-bold mb-2"
                        style={{ fontSize: '12px' }}
                      >
                        <i className="bi bi-play-fill me-1"></i> 
                        {animationState === 'idle' ? 'Kích hoạt Attack Animation' : 'Quay về Idle State'}
                      </button>
                      <span className="text-muted" style={{ fontSize: '10.5px' }}>
                        Bấm để kiểm tra tương tác hoạt họa thời gian thực
                      </span>
                    </div>

                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
