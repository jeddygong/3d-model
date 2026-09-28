<script setup>
import { computed, ref } from 'vue'

const activeNav = ref('新建模型')
const activeTab = ref('Image to 3D')
const displayMode = ref('Material')
const isGenerating = ref(false)
const progress = ref(0)
const showToast = ref(false)
const toastText = ref('')
const uploadedImage = ref(null)
const dimensions = ref({ length: 480, width: 260, height: 210 })
const polygonCount = ref('50k')
const autoSeparate = ref(true)
const viewerRotation = ref({ x: -12, y: 24 })

const navItems = [
  { label: '新建模型', icon: '＋' },
  { label: '任务队列', icon: '◷', count: 2 },
  { label: '历史记录', icon: '↺' },
]

const recentModels = [
  { name: 'Industrial valve', date: 'Today, 10:42', type: 'OBJ', color: 'teal' },
  { name: 'Desk lamp v2', date: 'Yesterday, 18:08', type: 'GLB', color: 'orange' },
  { name: 'Modular chair', date: 'Sep 26, 14:21', type: 'FBX', color: 'purple' },
]

const layers = [
  { name: 'Metal body', color: '#d4d8df', visible: true },
  { name: 'Blue gasket', color: '#2f7df6', visible: true },
  { name: 'Black handle', color: '#252a36', visible: true },
]
const layerState = ref(layers)

const generationLabel = computed(() => isGenerating.value ? `Generating ${progress.value}%` : 'Generate model')

/** Shows a temporary feedback message in the interface. @param {string} message - Message to display. @returns {void} */
function notify(message) {
  toastText.value = message
  showToast.value = true
  window.setTimeout(() => { showToast.value = false }, 2400)
}

/** Simulates selecting a reference image and updates the preview card. @param {Event} event - File input event. @returns {void} */
function handleUpload(event) {
  const file = event.target.files?.[0]
  if (!file) return
  uploadedImage.value = { name: file.name, url: URL.createObjectURL(file) }
  notify('Reference image added')
}

/** Simulates the asynchronous model generation pipeline with visible progress. @returns {void} */
function generateModel() {
  if (isGenerating.value) return
  isGenerating.value = true
  progress.value = 8
  const timer = window.setInterval(() => {
    progress.value += 13
    if (progress.value >= 100) {
      progress.value = 100
      window.clearInterval(timer)
      window.setTimeout(() => {
        isGenerating.value = false
        notify('Model generated successfully')
      }, 450)
    }
  }, 360)
}

/** Toggles visibility for one generated material layer. @param {number} index - Layer index. @returns {void} */
function toggleLayer(index) {
  layerState.value[index].visible = !layerState.value[index].visible
}

/** Updates the simulated 3D camera rotation while keeping movement bounded. @param {number} axis - Axis index. @param {number} amount - Rotation delta. @returns {void} */
function rotateViewer(axis, amount) {
  const key = axis === 0 ? 'x' : 'y'
  viewerRotation.value[key] = Math.max(-40, Math.min(40, viewerRotation.value[key] + amount))
}

/** Starts a simulated model download. @param {string} format - Export file format. @returns {void} */
function exportModel(format) {
  notify(`${format} export queued`)
}
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand"><div class="brand-mark">M</div><span>MODELRY</span></div>
      <div class="workspace-switch"><div class="workspace-avatar">A</div><div><strong>Acme Studio</strong><small>Personal workspace</small></div><span class="chevron">⌄</span></div>
      <nav class="main-nav">
        <button v-for="item in navItems" :key="item.label" :class="['nav-item', { active: activeNav === item.label }]" @click="activeNav = item.label"><span class="nav-icon">{{ item.icon }}</span><span>{{ item.label }}</span><em v-if="item.count">{{ item.count }}</em></button>
      </nav>
      <div class="side-divider"></div>
      <div class="side-label">工作区</div>
      <button class="nav-item muted" :class="{ active: activeNav === '资产库' }" @click="activeNav = '资产库'"><span class="nav-icon">▣</span><span>资产库</span></button>
      <button class="nav-item muted" :class="{ active: activeNav === '设置' }" @click="activeNav = '设置'"><span class="nav-icon">⚙</span><span>设置</span></button>
      <div class="sidebar-bottom"><div class="usage-line"><span>剩余点数</span><span>74 / 100</span></div><div class="usage-bar"><i></i></div><button class="upgrade-btn" @click="notify('升级方案已打开')">升级方案 <span>↗</span></button><div class="user-card"><div class="avatar">JL</div><div><strong>Jordan Lee</strong><small>专业版账户</small></div><span>•••</span></div></div>
    </aside>

    <main class="main-content">
      <header class="topbar"><div class="breadcrumbs"><span>工作台</span><b>/</b><strong>{{ activeNav }}</strong></div><div class="top-actions"><button class="icon-button" @click="notify('帮助中心已打开')">?</button><button class="icon-button" @click="notify('暂无新通知')">♧</button><div class="top-avatar">JL</div></div></header>
      <div v-if="activeNav === '新建模型'" class="page-heading"><div><div class="eyebrow">AI 3D 模型生成器 <span class="live-dot"></span> 在线</div><h1>让想法 <span>成为现实。</span></h1><p>通过一张图片，生成可用于生产的 3D 模型。</p></div><div class="heading-status"><span class="status-check">✓</span><div><strong>生成流程就绪</strong><small>所有系统运行正常</small></div></div></div>

      <div v-if="activeNav === '新建模型'" class="content-grid">
        <section class="panel setup-panel">
          <div class="panel-head"><div><h2>创建模型</h2><p>上传参考图并调整生成参数。</p></div><span class="step-count">01 — 03</span></div>
          <div class="tabs"><button :class="{ selected: activeTab === 'Image to 3D' }" @click="activeTab = 'Image to 3D'">图片生成 3D</button><button :class="{ selected: activeTab === 'Text to 3D' }" @click="activeTab = 'Text to 3D'">文字生成 3D <span class="beta">测试版</span></button></div>
          <div class="form-section"><div class="section-title"><span class="number">1</span><div><strong>Reference image</strong><small>Best results use a clear, centered object</small></div></div><label class="upload-zone"><input type="file" accept="image/*" @change="handleUpload"/><template v-if="!uploadedImage"><div class="upload-icon">↑</div><strong>Drop an image here, or <span>browse</span></strong><small>PNG, JPG or WEBP · Max 20 MB</small></template><template v-else><img :src="uploadedImage.url" class="uploaded-thumb" alt="Uploaded reference"/><div><strong>{{ uploadedImage.name }}</strong><small>Ready to process · Click to replace</small></div><button class="remove-image" @click.prevent="uploadedImage = null">×</button></template></label></div>
          <div class="form-section"><div class="section-title"><span class="number">2</span><div><strong>Model settings</strong><small>Define the physical dimensions of your asset</small></div></div><div class="input-row"><label>Length <div class="input-wrap"><input v-model="dimensions.length" type="number"/><span>mm</span></div></label><label>Width <div class="input-wrap"><input v-model="dimensions.width" type="number"/><span>mm</span></div></label><label>Height <div class="input-wrap"><input v-model="dimensions.height" type="number"/><span>mm</span></div></label></div><div class="setting-row"><div><strong>Separate by material</strong><small>Split the model into editable layers</small></div><button :class="['toggle', { on: autoSeparate }]" @click="autoSeparate = !autoSeparate"><i></i></button></div><div class="setting-row"><div><strong>Mesh density</strong><small>Higher density preserves more detail</small></div><div class="segmented"><button v-for="option in ['10k', '50k', '200k']" :key="option" :class="{ active: polygonCount === option }" @click="polygonCount = option">{{ option }}</button></div></div></div>
          <div class="generate-wrap"><button class="generate-btn" :disabled="isGenerating" @click="generateModel"><span class="sparkle">✦</span>{{ isGenerating ? `生成中 ${progress}%` : '生成模型' }}<span class="arrow">→</span></button><div class="generation-note"><span>✦</span> 消耗 2 点数 · 预计约 2 分钟</div></div>
        </section>

        <section class="panel preview-panel">
          <div class="panel-head preview-head"><div><h2>3D preview</h2><p>Inspect your generated asset in real-time.</p></div><div class="preview-tools"><button :class="{ active: displayMode === 'Material' }" @click="displayMode = 'Material'">◉</button><button :class="{ active: displayMode === 'White' }" @click="displayMode = 'White'">◌</button><button :class="{ active: displayMode === 'Wireframe' }" @click="displayMode = 'Wireframe'">▤</button></div></div>
          <div class="viewport"><div class="viewport-toolbar"><button @click="notify('View reset')">⌂</button><button @click="rotateViewer(0, -8)">↶</button><button @click="rotateViewer(0, 8)">↷</button><span></span><button @click="notify('Fullscreen preview opened')">⛶</button></div><div class="axis"><i>X</i><i>Y</i><i>Z</i></div><div class="grid-plane"></div><div class="model-stage" :style="{ transform: `rotateX(${viewerRotation.x}deg) rotateY(${viewerRotation.y}deg)` }"><div class="model-shadow"></div><div :class="['mock-model', displayMode.toLowerCase()]"><div class="body-main"></div><div class="body-cap"></div><div class="body-ring"></div><div class="body-handle"></div><div class="body-foot left"></div><div class="body-foot right"></div></div></div><div v-if="isGenerating" class="generation-overlay"><div class="loader-ring"></div><strong>Building your model</strong><span>{{ progress }}% · reconstructing geometry</span><div class="progress-track"><i :style="{ width: `${progress}%` }"></i></div></div><div class="view-cube"><b>TOP</b><i>FRONT</i><em>RIGHT</em></div></div>
          <div class="preview-footer"><div><span class="status-dot"></span><strong>{{ isGenerating ? 'Processing...' : 'Ready to inspect' }}</strong><small> · Generated 2 min ago</small></div><button class="reset-view" @click="viewerRotation = { x: -12, y: 24 }">Reset view</button></div>
          <div class="info-grid"><div class="info-block"><span>DIMENSIONS</span><strong>{{ dimensions.length }} × {{ dimensions.width }} × {{ dimensions.height }} <small>mm</small></strong></div><div class="info-block"><span>POLYGONS</span><strong>{{ polygonCount }} <small>triangles</small></strong></div><div class="info-block"><span>VERTICES</span><strong>26,431</strong></div></div>
          <div class="layers"><div class="layers-head"><div><h3>Material layers</h3><small>{{ autoSeparate ? '3 editable layers' : 'Layer separation disabled' }}</small></div><button @click="notify('Layer names are ready to edit')">Edit names</button></div><div v-for="(layer, index) in layerState" :key="layer.name" class="layer-row"><span class="layer-color" :style="{ background: layer.color }"></span><span>{{ layer.name }}</span><button :class="['visibility', { hidden: !layer.visible }]" @click="toggleLayer(index)">{{ layer.visible ? '◉' : '⊘' }}</button></div></div>
          <div class="export-row"><button v-for="format in ['FBX', 'GLB', 'OBJ']" :key="format" @click="exportModel(format)">↓ {{ format }}</button><button class="more-export" @click="notify('More export formats opened')">•••</button></div>
        </section>
      </div>

      <section v-if="activeNav === '新建模型'" class="recent-section"><div class="recent-head"><div><h2>最近模型</h2><p>集中查看你最近创建的模型。</p></div><button @click="activeNav = '历史记录'">查看历史 <span>→</span></button></div><div class="recent-list"><div v-for="model in recentModels" :key="model.name" class="recent-card"><div :class="['recent-thumb', model.color]"><div class="mini-shape"></div></div><div class="recent-copy"><strong>{{ model.name }}</strong><span>{{ model.date }}</span></div><span class="file-tag">{{ model.type }}</span><button class="more-btn" @click="notify(`${model.name} 操作菜单已打开`)" >•••</button></div></div></section>
      <section v-else class="page-placeholder"><div class="placeholder-icon">{{ activeNav === '任务队列' ? '◷' : activeNav === '历史记录' ? '↺' : activeNav === '资产库' ? '▣' : '⚙' }}</div><h1>{{ activeNav }}</h1><p>{{ activeNav === '任务队列' ? '查看模型生成进度，完成后可打开或下载。' : activeNav === '历史记录' ? '查看过往生成的模型与导出记录。' : activeNav === '资产库' ? '管理你的模型资产、参考图片与导出文件。' : '管理账户、工作区与生成偏好。' }}</p><div class="placeholder-card"><span>模拟数据</span><strong>该模块已接入前端导航，后续可连接真实接口。</strong></div></section>
      <footer class="footer-note"><span>Modelry 工作台 v1.4.2</span><span>让想法成为现实。</span><span>使用说明 ↗</span></footer>
    </main>
    <transition name="toast"><div v-if="showToast" class="toast"><span>✓</span>{{ toastText }}</div></transition>
  </div>
</template>
