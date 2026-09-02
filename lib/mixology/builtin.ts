// lib/mixology/builtin.ts
// 独家特调 · 官方出厂材料：序言/基底/杯型的默认文案，以及一件示范机括「朗读」。
// 这几件是"素杯也好喝"的底线——玩家一件配料不装、只拿一张角色卡也能开局。
// 文案升级时 bump MIX_BUILTIN_VERSION，storage 会用出厂内容刷新官方件。

import type { MixMechanismMaterial, MixTextMaterial } from "./types";

export const MIX_BUILTIN_VERSION = 4;

export const MIX_BUILTIN_PREFACE_ID = "mix_builtin_preface";
export const MIX_BUILTIN_BASE_ID = "mix_builtin_base";
export const MIX_BUILTIN_GLASS_ID = "mix_builtin_glass";

const now = () => Date.now();

/**
 * 官方序言：提示词最顶上的开场说明（历史上曾硬编码在组装器里的那段固定文案）。
 * 与基底/杯型同规则：槽位里选了才生效，没配提示词就没有这一段，不做暗兜底。
 * 「越靠后的要求优先级越高」是段落排序的配套约定，自建序言时也建议保留。
 */
export function createBuiltinPreface(): MixTextMaterial {
    return {
        id: MIX_BUILTIN_PREFACE_ID,
        kind: "preface",
        name: "官方 · 标准序言",
        hook: "出厂自带的开场声明，点明扮演与优先级",
        author: "独家特调",
        content: "这是一场沉浸式角色扮演，你要扮演的角色是{{char}}。下方依次给出扮演规则、角色资料与输出要求，请全部遵守；越靠后的要求优先级越高。\n（# 为分段，## 为该段下的具体条目；更深的层级来自创作者自己的分层。）",
        tags: ["官方"],
        createdAt: now(),
        updatedAt: now(),
    };
}

/** 官方基底：扮演总纲 */
export function createBuiltinBase(): MixTextMaterial {
    return {
        id: MIX_BUILTIN_BASE_ID,
        kind: "base",
        name: "官方 · 标准扮演",
        hook: "出厂自带的扮演总纲，稳定不出戏",
        author: "独家特调",
        content: [
            "你将完全成为「{{char}}」，以第一视角活在故事里，与「{{user}}」进行沉浸式角色扮演。",
            "- 始终以{{char}}的身份、性格、说话方式行动，绝不跳出角色、绝不以 AI 或助手自称。",
            "- 只扮演{{char}}与故事中的旁白/配角，绝不代替{{user}}说话、行动或下决定。",
            "- 依据角色资料与已发生的剧情推进故事，主动推动情节，不原地打转，不重复已说过的内容。",
            "- 角色资料没写的细节可以合理补全，但不得与已有设定矛盾。",
            "- 允许剧情出现冲突、拒绝与负面情绪，角色不是讨好机器；贴合人设比讨好{{user}}更重要。",
        ].join("\n"),
        tags: ["官方"],
        createdAt: now(),
        updatedAt: now(),
    };
}

/** 官方杯型：输出格式（含正文语义协议的书写引导） */
export function createBuiltinGlass(): MixTextMaterial {
    return {
        id: MIX_BUILTIN_GLASS_ID,
        kind: "glass",
        name: "官方 · 正文与对白",
        hook: "出厂自带的输出格式，正文流畅、对白分明",
        author: "独家特调",
        content: [
            "以小说正文的形式输出，第三人称叙述，每轮 2~4 个自然段，段落之间空一行。",
            "- 叙述里穿插动作、神态与环境细节，让画面能被看见；不要写成流水账。",
            "- 每轮在留有余韵处收笔，给{{user}}接话的空间；不要替{{user}}总结感受。",
        ].join("\n"),
        tags: ["官方"],
        createdAt: now(),
        updatedAt: now(),
    };
}

export const MIX_BUILTIN_READER_ID = "mix_builtin_reader";

/**
 * 官方机括「朗读」：连接器（mix.call）的样板。
 * 钩子把每轮正文记进 store，界面在正文尾部放一颗播放按钮——点了才合成，不点不花钱。
 * 需要玩家在酒柜「连接器」里用「MiniMax 语音」预设建一个叫 tts 的连接器。
 */
export function createBuiltinReader(): MixMechanismMaterial {
    return {
        id: MIX_BUILTIN_READER_ID,
        kind: "mechanism",
        name: "官方 · 朗读",
        hook: "点一下把最新回复念出来，走你自己的 MiniMax 连接器",
        author: "独家特调",
        tags: ["官方", "语音", "连接器"],
        connectors: ["tts"],
        layout: { x: 0, y: 0, w: 100, h: 16, slot: "flow-bottom", autoHeight: true, plate: false, chrome: "none" },
        script: [
            "// 每轮正文记进存储，界面按它合成。去掉状态栏/小剧场壳和正文标记，只留能念的字。",
            "function onAfterReply(ctx) {",
            "  var text = String(ctx.text || '')",
            "    .replace(/\\[状态栏[^\\]]*\\][\\s\\S]*?\\[\\/状态栏\\]/g, '')",
            "    .replace(/\\[小剧场[^\\]]*\\][\\s\\S]*?\\[\\/小剧场\\]/g, '')",
            "    .replace(/[*~]/g, '')",
            "    .replace(/\\n{2,}/g, '\\n')",
            "    .trim();",
            "  return { store: { 最近回复: text.slice(0, 2000) } };",
            "}",
        ].join("\n"),
        panelHtml: [
            "<style>",
            "  .r{display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:999px;background:rgba(141,123,245,.14);border:1px solid rgba(141,123,245,.28);color:#e9e5ff;font-size:12px}",
            "  .r button{border:0;border-radius:999px;padding:6px 14px;font-weight:700;font-size:12px;cursor:pointer;background:#8d7bf5;color:#fff}",
            "  .r button[disabled]{opacity:.45;cursor:default}",
            "  .r .s{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:.8}",
            "</style>",
            "<div class=\"r\"><button id=\"b\">▶ 朗读</button><span class=\"s\" id=\"s\">合成最新一轮回复，点了才合成</span></div>",
            "<script>",
            "(function(){",
            "  var b=document.getElementById('b'), s=document.getElementById('s');",
            "  var audio=null, cacheText='', cacheUrl='', playing=false;",
            "  function latest(){ return String((window.MIX_STORE||{}).最近回复||'').trim(); }",
            "  function say(t){ s.textContent=t; }",
            "  function hexToBlob(hex){",
            "    var n=hex.length>>1, bytes=new Uint8Array(n);",
            "    for(var i=0;i<n;i++) bytes[i]=parseInt(hex.substr(i*2,2),16);",
            "    return new Blob([bytes],{type:'audio/mpeg'});",
            "  }",
            "  function stop(){ if(audio){ audio.pause(); audio=null; } playing=false; b.textContent='▶ 朗读'; }",
            "  function play(url){",
            "    stop(); audio=new Audio(url); playing=true; b.textContent='■ 停止'; say('播放中…');",
            "    audio.onended=function(){ stop(); say('播完了，再点一次可重听（不重复合成）'); };",
            "    audio.onerror=function(){ stop(); say('播放失败'); };",
            "    audio.play().catch(function(){ stop(); say('浏览器拦住了自动播放，再点一次'); });",
            "  }",
            "  b.onclick=function(){",
            "    if(playing){ stop(); say('已停止'); return; }",
            "    var text=latest();",
            "    if(!text){ say('还没有可念的回复'); return; }",
            "    if(text===cacheText && cacheUrl){ play(cacheUrl); return; }",
            "    b.disabled=true; say('合成中…');",
            "    window.mix.call('tts',{ text:text }).then(function(r){",
            "      var d=r.data||{};",
            "      var hex=d.data&&d.data.audio;",
            "      if(!hex){ var m=(d.base_resp&&d.base_resp.status_msg)||('接口返回 '+r.status); say('合成失败：'+m); return; }",
            "      if(cacheUrl) URL.revokeObjectURL(cacheUrl);",
            "      cacheText=text; cacheUrl=URL.createObjectURL(hexToBlob(hex));",
            "      play(cacheUrl);",
            "    }).catch(function(e){ say(e.missing?'先到酒柜「连接器」里建一个叫 tts 的连接器':('失败：'+e.message)); }).then(function(){ b.disabled=false; });",
            "  };",
            "  window.onMixSync=function(){ if(!playing) say(latest()?'合成最新一轮回复，点了才合成':'还没有可念的回复'); };",
            "})();",
            "</script>",
        ].join("\n"),
        createdAt: now(),
        updatedAt: now(),
    };
}
