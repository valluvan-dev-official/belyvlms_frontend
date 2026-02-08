import{c as r}from"./createLucideIcon-CZphTAsl.js";import{j as n}from"./index-DugLq9wu.js";/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const s=[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]],i=r("refresh-cw",s),a=e=>{const t=String(e||"").toUpperCase();return t==="INVITED"?"bg-[#E6F5F5] text-[#4ECDC4]":t==="PENDING_APPROVAL"?"bg-[#FFF3CD] text-[#F59E0B]":t==="ONBOARDED"?"bg-[#D4F4DD] text-[#2B9A66]":t==="DROPPED"||t==="ERROR"?"bg-[#FFE5E5] text-[#E63946]":"bg-gray-100 text-gray-600"};function E({status:e}){return n.jsx("span",{className:`px-2 py-1 rounded-lg text-xs font-semibold ${a(e)}`,children:String(e||"").replaceAll("_"," ")})}export{i as R,E as S};
