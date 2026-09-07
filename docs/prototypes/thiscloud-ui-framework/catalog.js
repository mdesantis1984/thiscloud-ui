const categories={'Foundations/Layout':['BreakpointProvider','Container','Divider','Element','FocusTrap','Grid','Hidden','Highlighter','Image','Link','Paper','ScrollToTop','Skeleton','SwipeArea','Typography'],Actions:['Button','ButtonFab','ButtonGroup','IconButton','ToggleIconButton','Toolbar'],'Inputs/Forms':['Autocomplete','Checkbox','Chips','ChipSet','ColorPicker','DatePicker','DropZone','Field','FileUpload','Form','NumericField','Radio','Select','Slider','Switch','TextField','TimePicker'],'Navigation/Disclosure':['AppBar','Breadcrumbs','Carousel','Drawer','ExpansionPanels','List','Menu','NavMenu','Pagination','Tabs','TreeView'],'Surfaces/Content':['Avatar','Badge','Card','Icons','Rating'],'Feedback/Overlays':['Alert','Dialog','MessageBox','Overlay','Popover','Progress','Snackbar','Tooltip'],'Data/Visualization':['BarChart','DataGrid','DonutChart','LineChart','PieChart','SimpleTable','StackedBarChart','Table','Timeline']};const production=new Set(['BreakpointProvider','Container','Divider','Grid','Image','Link','Paper','Typography','Button','ButtonFab','ButtonGroup','IconButton','Toolbar','Checkbox','Field','Form','NumericField','Radio','Select','Slider','Switch','TextField','AppBar','Breadcrumbs','Drawer','List','Menu','Pagination','Tabs','Avatar','Badge','Card','Alert','Dialog','Overlay','Popover','Progress','Snackbar','Tooltip','DataGrid','Table','SimpleTable','Timeline']);const all=Object.entries(categories).flatMap(([category,names])=>names.map(name=>({name,category,slug:name.replace(/([a-z])([A-Z])/g,'$1-$2').toLowerCase(),status:production.has(name)?'production':'roadmap'})));const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));const itemFor=s=>all.find(x=>x.slug===s||x.name===s),catSlug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-'),icon=n=>`<span class="ms" aria-hidden="true">${n}</span>`;let locale=localStorage.getItem('thiscloud-ui-locale');if(!['en','es'].includes(locale))locale='es';let data,icons=null,shown=48,selected=null;const t=p=>p.split('.').reduce((o,k)=>o?.[k],data)??p;const badge=s=>`<span class="pill ${s}">${t('status.'+s)}</span>`;
const publicWebApi=Object.freeze({Switch:{identity:'TcSwitch',boundary:'<tc-switch>',code:"import '@thiscloud/ui-web';\n<tc-switch label=\"Notifications\"></tc-switch>"},TextField:{identity:'TcTextField',boundary:'<tc-text-field>',code:"import '@thiscloud/ui-web';\n<tc-text-field label=\"Organization\"></tc-text-field>"},Field:{identity:'ValidationControl',boundary:'type contract',code:"import type { ValidationControl } from '@thiscloud/ui-web';"},Form:{identity:'attachFormValidation(nativeForm, options)',boundary:'native form helper',code:"import { attachFormValidation } from '@thiscloud/ui-web';\nattachFormValidation(nativeForm, options);"}});all.forEach(record=>{record.api=publicWebApi[record.name];record.status=record.api?'rcApi':'demoOnly'});const routeStatus=name=>itemFor(name)?.status||'demoOnly',apiBoundary=api=>`<span class="pill info">${esc(api.identity)}</span><span class="pill">${esc(api.boundary)}</span>`,demoBoundary=()=>`<span class="pill demoOnly">${t('component.demoOnly')}</span>`;
function chrome(){document.documentElement.lang=locale;document.title=t('meta.title');for(const id of ['skip','brandSupport','workspace','workspaceStrong','workspaceVersion','footerStatus','footerSupport'])document.getElementById(id).textContent=id==='skip'?t('meta.skip'):id==='brandSupport'?t('meta.brandSupport'):id.startsWith('workspace')?t('meta.'+id):id==='footerStatus'?t('meta.rcPreview'):t('meta.footerSupport');const q=document.getElementById('globalSearch');q.setAttribute('aria-label',t('header.searchLabel'));q.placeholder=t('header.searchPlaceholder');document.getElementById('searchHint').textContent=t('header.searchLabel');document.getElementById('menu').setAttribute('aria-label',t('header.openNav'));document.getElementById('theme').setAttribute('aria-label',t('header.toggleTheme'));document.getElementById('download').setAttribute('aria-label',t('header.downloadPackage'));document.getElementById('downloadText').textContent=t('header.download');document.getElementById('guestText').textContent=t('header.guest');document.getElementById('density').textContent=document.documentElement.dataset.density==='compact'?t('header.comfortable'):t('header.compact');document.getElementById('language').textContent=t('header.language');document.getElementById('language').setAttribute('aria-label',t('header.switchLanguage'));document.getElementById('dialogTitle').textContent=t('dialog.title');document.getElementById('dialogText').textContent=t('dialog.text');document.getElementById('dialogConfirm').textContent=t('dialog.confirm');document.getElementById('dialogCancel').textContent=t('dialog.cancel');document.getElementById('toast').textContent=t('toast.updated');if(location.hash==='#main')history.replaceState(null,'','#explore');nav();render();wireSearch();}
function nav(){const links=[['explore',t('nav.explore'),'explore'],...Object.keys(categories).flatMap(c=>[[catSlug(c),t('nav.categories.'+c),'category'],...categories[c].map(n=>[itemFor(n.replace(/([a-z])([A-Z])/g,'$1-$2').toLowerCase()).slug,n,'component'])]),['download',t('nav.download'),'guidance'],['getting-started',t('nav.gettingStarted'),'guidance'],['customization',t('nav.customization'),'guidance'],['accessibility',t('nav.accessibility'),'guidance'],['build-status',t('nav.buildStatus'),'guidance'],['icons',t('nav.icons'),'icons']];const groups=[[t('nav.explore'),links.splice(0,1)],[t('nav.components'),links.splice(0,all.length+7)],[t('nav.guidance'),links.splice(0,5)],[t('nav.icons'),links]];document.getElementById('sideNav').innerHTML=groups.map(([h,ls])=>`<section class="nav-section"><div class="nav-label">${esc(h)}</div><nav class="nav" aria-label="${esc(h)}">${ls.map(([s,l,type])=>`<a class="${type==='component'?'component':''}" href="#${type==='category'?'category/':type==='component'?'component/':type==='guidance'?'guidance/':''}${s}">${icon(type==='icons'?'category':type==='category'?'widgets':type==='component'?'radio_button_checked':type==='guidance'?'menu_book':'explore')}<span>${esc(l)}</span></a>`).join('')}</nav></section>`).join('');}
 function breakpointName(width = window.innerWidth) {
   if (width < 480) return 'XS';
   if (width < 768) return 'SM';
   if (width < 1024) return 'MD';
   if (width < 1280) return 'LG';
   return 'XL';
 }
  function breakpointButtons(labels, active, attr) {
    return labels.map(label => [
      `<button class="btn ${label === active ? 'primary' : ''}"`,
      `${attr}="${label}" aria-pressed="${label === active}">${label}</button>`
    ].join('')).join('');
  }
  function foundationDemo(name, variant, d) {
    if (name === 'BreakpointProvider') {
      if (variant === 'overview') return [
        '<div class="foundation-card breakpoint-demo"><strong>', d.actualViewport,
        '</strong><output data-actual-breakpoint>', breakpointName(),
        `</output><span class="muted">${d.actualViewportDetail}</span></div>`
      ].join('');
      if (variant === 'variants') return [
        `<div class="foundation-card breakpoint-demo" data-breakpoint-demo><strong>${d.simulatedViewport}</strong>`,
        `<div class="demo-row">${breakpointButtons(['XS', 'SM', 'MD', 'LG', 'XL'], 'MD', 'data-breakpoint-choice')}</div>`,
        `<output data-breakpoint-value>MD</output><span class="muted">${d.simulatedViewportDetail}</span></div>`
      ].join('');
      return `<div class="foundation-card breakpoint-state"><strong>${d.providerState}</strong>`
        + `<div class="responsive-state"><span>${d.currentViewport}</span>`
        + `<b data-live-breakpoint>${breakpointName()}</b></div>`
        + `<span class="muted">${d.providerStateDetail}</span></div>`;
    }
    if (name === 'Container') {
      const width = variant === 'variants' ? '70%' : '88%';
      const title = variant === 'states' ? d.containerMeasured : d.containerBehavior;
      const label = variant === 'variants' ? d.fixedWidth : d.responsive;
      return [
        `<div class="foundation-card container-demo"><strong>${title}</strong><div class="container-outer">`,
        `<div class="container-inner" style="width:${width};max-width:720px">`,
        `<span>${label}</span><output data-container-width>0px</output></div></div>`,
        `<span class="muted">${d.containerDetail}</span></div>`
      ].join('');
    }
    if (name === 'Grid') {
      const columns = variant === 'variants' ? 4 : 12;
      const items = variant === 'overview' ? [3, 3, 3, 3] : variant === 'variants' ? [1, 2, 1] : [4, 4, 4];
      const title = variant === 'states' ? d.gridState : d.gridAnatomy;
      const cells = items.map((span, i) => `<i style="grid-column:span ${span}" data-span="${span}">${i + 1}</i>`).join('');
      return [
        `<div class="foundation-card grid-demo" data-grid-demo><strong>${title}</strong>`,
        `<div class="grid-12" data-grid-columns="${columns}" style="display:grid;gap:16px;`,
        `grid-template-columns:repeat(${columns},1fr)">${cells}</div>`,
        `<div class="demo-row">${breakpointButtons(['12', '8', '4'], String(columns), 'data-grid-choice')}</div>`,
        `<output data-grid-summary>${columns} ${d.columns} · ${d.gap}</output></div>`
      ].join('');
    }
    if (name === 'Hidden') {
      if (variant === 'overview') return [
        `<div class="foundation-card hidden-demo" data-hidden-demo><strong>${d.conditionalVisibility}</strong>`,
        `<div class="demo-row">${breakpointButtons([d.show, d.hide], d.show, 'data-hidden-choice')}</div>`,
        `<div data-hidden-target>${d.visibleContent}</div><span class="muted">${d.hiddenDetail}</span></div>`
      ].join('');
      if (variant === 'variants') return [
        `<div class="foundation-card hidden-demo" data-hidden-demo><strong>${d.simulatedVisibility}</strong>`,
        `<div class="demo-row">${breakpointButtons(['XS', 'MD', 'XL'], 'MD', 'data-hidden-breakpoint')}</div>`,
        `<div data-hidden-target>${d.visibleContent}</div><span class="muted">${d.simulatedVisibilityDetail}</span></div>`
      ].join('');
      return `<div class="foundation-card hidden-state"><strong>${d.actualVisibility}</strong>`
        + `<div class="responsive-state"><span>${d.currentViewport}</span>`
        + `<b data-hidden-live>${breakpointName()}</b></div>`
        + `<span class="muted">${d.actualVisibilityDetail}</span></div>`;
   }
 }
 function wireFoundationDemos() {
   wireSurfaceDemos();
   const current = breakpointName();
   document.querySelectorAll('[data-actual-breakpoint], [data-live-breakpoint], [data-hidden-live]').forEach(node => node.textContent = current);
   window.onresize = () => {
     const next = breakpointName();
     document.querySelectorAll('[data-actual-breakpoint], [data-live-breakpoint], [data-hidden-live]').forEach(node => node.textContent = next);
   };
   document.querySelectorAll('[data-container-width]').forEach(output => {
     const inner = output.closest('.container-inner');
     output.textContent = `${Math.round(inner.getBoundingClientRect().width)}px`;
   });
   document.querySelectorAll('[data-breakpoint-choice]').forEach(button => button.onclick = () => {
     const root = button.closest('[data-breakpoint-demo]');
     root.querySelectorAll('[data-breakpoint-choice]').forEach(item => item.setAttribute('aria-pressed', item === button));
     root.querySelector('[data-breakpoint-value]').textContent = button.dataset.breakpointChoice;
   });
   document.querySelectorAll('[data-grid-choice]').forEach(button => button.onclick = () => {
     const root = button.closest('[data-grid-demo]');
     const columns = button.dataset.gridChoice;
     root.querySelectorAll('[data-grid-choice]').forEach(item => item.setAttribute('aria-pressed', item === button));
     root.querySelector('.grid-12').style.gridTemplateColumns = `repeat(${columns},1fr)`;
     root.querySelector('.grid-12').dataset.gridColumns = columns;
     root.querySelector('[data-grid-summary]').textContent = `${columns} ${t('demo.columns')} · ${t('demo.gap')}`;
   });
   document.querySelectorAll('[data-hidden-choice]').forEach(button => button.onclick = () => {
     const root = button.closest('[data-hidden-demo]');
     const visible = button.dataset.hiddenChoice === t('demo.show');
     root.querySelectorAll('[data-hidden-choice]').forEach(item => item.setAttribute('aria-pressed', item === button));
     root.querySelector('[data-hidden-target]').hidden = !visible;
   });
   document.querySelectorAll('[data-hidden-breakpoint]').forEach(button => button.onclick = () => {
     const root = button.closest('[data-hidden-demo]');
     root.querySelectorAll('[data-hidden-breakpoint]').forEach(item => item.setAttribute('aria-pressed', item === button));
     root.querySelector('[data-hidden-target]').hidden = button.dataset.hiddenBreakpoint === 'XS';
   });
      wireSelectionInputs();
       wireInputBatchTwo();
       wireFieldDemos();
       wireRadioDemo();
       wireNativeInputs();
       wireUploadDemos();
      wireVisualFoundationDemos();
      wireActionDemos();
      wireNavigationDemos();
       wireFeedbackDemos();
  }
  const feedbackNames = new Set(['Alert', 'Dialog', 'MessageBox', 'Overlay', 'Popover', 'Progress',
    'Snackbar', 'Tooltip']);
   let feedbackInstance = 0;
   function feedbackFocusables(dialog) {
     return [...dialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')]
       .filter(node => !node.disabled && !node.hidden && node.getClientRects().length);
   }
   function wireFeedbackModals() {
      document.querySelectorAll('[data-feedback-modal-demo]').forEach(root => {
       const dialog = root.querySelector('dialog'), opener = root.querySelector('[data-feedback-open]');
       const status = root.querySelector('[data-feedback-status]');
       let invokingControl = null;
       const restore = () => { const target = invokingControl;
         if (target?.isConnected && !target.disabled) queueMicrotask(() => {
           if (!dialog.open) target.focus();
         }); };
       const close = outcome => { if (dialog.open) dialog.close(outcome); };
       opener.onclick = event => { invokingControl = event.currentTarget; dialog.showModal();
          status.textContent = root.dataset.feedbackKind === 'messagebox' ? t('demo').feedback.messageBox.opened
            : t('demo').feedback.dialog.opened;
          (dialog.querySelector('[data-initial]') || feedbackFocusables(dialog)[0])?.focus(); };
        dialog.querySelectorAll('[data-feedback-close]').forEach(button =>
          button.onclick = () => close(button.dataset.feedbackOutcome));
        dialog.addEventListener('cancel', event => { event.preventDefault(); close('cancelled'); });
       dialog.addEventListener('close', () => { status.textContent = root.dataset.feedbackKind === 'messagebox'
          ? t('demo').feedback.messageBox[dialog.returnValue === 'confirmed' ? 'confirmed' : 'cancelled']
          : t('demo').feedback.dialog.closed; restore(); });
       dialog.addEventListener('keydown', event => { if (event.key !== 'Tab') return;
          const enabled = feedbackFocusables(dialog); if (!enabled.length) return;
          const first = enabled[0], last = enabled[enabled.length - 1];
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        });
      });
    }
    function wireFeedbackOverlays() {
      document.querySelectorAll('[data-feedback-overlay-demo]').forEach(root => {
         const trigger = root.querySelector('[data-overlay-open]');
         const dismiss = root.querySelector('[data-overlay-dismiss]');
         const controlled = root.querySelector('[data-overlay-controlled]');
         const overlay = root.querySelector('[data-feedback-overlay]');
        const setActive = active => { overlay.hidden = !active; controlled.setAttribute('aria-busy', String(active));
          controlled.inert = active; root.querySelector('[data-overlay-status]').textContent = active
            ? t('demo').feedback.overlay.active : t('demo').feedback.overlay.ready; };
        trigger.onclick = () => setActive(true); dismiss.onclick = () => setActive(false);
        setActive(root.dataset.feedbackState === 'active');
      });
    }
    function feedbackDemo(name, variant, d) {
      const copy = d.feedback, id = `feedback-${name.toLowerCase()}-${variant}-${++feedbackInstance}`;
      if (name === 'Popover') {
         const popoverId = `${id}-surface`, titleId = `${id}-title`, open = variant !== 'states';
         return `<div class="feedback-demo feedback-popover-demo" data-feedback-popover-demo>`
           + `<button type="button" class="btn primary" data-popover-trigger popovertarget="${popoverId}"`
            + ` aria-controls="${popoverId}" aria-expanded="${open}"`
            + ` style="anchor-name:--${id}-anchor">${copy.popover.trigger}</button>`
           + `<div id="${popoverId}" popover="auto" role="region" aria-labelledby="${titleId}"`
            + ` data-popover-initial-open="${open}" style="position-anchor:--${id}-anchor">`
            + `<strong id="${titleId}">${copy.popover.title}</strong><p>${copy.popover.text}</p></div>`
            + `<span class="feedback-status" data-popover-status>`
            + `${open ? copy.popover.opened : copy.popover.closed}</span></div>`;
      }
      if (name === 'Tooltip') {
         const tooltipId = `${id}-tip`, shown = variant !== 'states';
         return `<div class="feedback-demo feedback-tooltip-demo" data-feedback-tooltip-demo>`
           + `<button type="button" class="btn primary" data-tooltip-trigger aria-describedby="${tooltipId}"`
           + ` style="anchor-name:--${id}-anchor">${copy.tooltip.trigger}</button>`
            + `<span id="${tooltipId}" role="tooltip" ${shown ? '' : 'hidden'}`
            + ` style="position-anchor:--${id}-anchor">${copy.tooltip.text}</span>`
            + `<span class="feedback-status" data-tooltip-status>`
            + `${shown ? copy.tooltip.shown : copy.tooltip.hidden}</span></div>`;
      }
      if (name === 'Dialog' || name === 'MessageBox') {
        const modalId = `${id}-modal`, titleId = `${id}-title`, textId = `${id}-text`;
        const message = name === 'Dialog' ? copy.dialog : copy.messageBox;
        return `<div class="feedback-demo" data-feedback-modal-demo data-feedback-kind="${name.toLowerCase()}">`
          + `<button type="button" class="btn primary" data-feedback-open>${message.trigger}</button>`
          + `<dialog id="${modalId}" class="feedback-modal" aria-labelledby="${titleId}" aria-describedby="${textId}"`
          + `${name === 'MessageBox' ? ' role="alertdialog" aria-modal="true"' : ''}>`
          + `<h3 id="${titleId}">${message.title}</h3><p id="${textId}">${message.text}</p><div class="actions">`
          + `<button type="button" class="btn" data-feedback-close data-feedback-outcome="cancelled" data-initial>`
           + `${message.cancel}</button><button type="button" class="btn primary"`
           + ` data-feedback-close data-feedback-outcome="confirmed">`
           + `${message.confirm}</button></div></dialog><span class="feedback-status"`
           + ` data-feedback-status>${message.ready}</span></div>`;
      }
      if (name === 'Overlay') {
        const overlay = copy.overlay, active = variant === 'states';
         return `<div class="feedback-demo" data-feedback-overlay-demo`
           + ` data-feedback-state="${active ? 'active' : 'ready'}">`
           + `<button type="button" class="btn primary" data-overlay-open>`
           + `${overlay.trigger}</button>`
          + `<div class="feedback-bounded"><div class="feedback-controlled" data-overlay-controlled`
          + ` aria-busy="${active}"><strong>${overlay.contentTitle}</strong><p>${overlay.content}</p>`
          + `</div><div class="feedback-overlay" data-feedback-overlay ${active ? '' : 'hidden'} role="status">`
           + `<span>${overlay.loading}</span><button type="button" class="btn"`
           + ` data-overlay-dismiss>${overlay.dismiss}</button>`
          + `<span aria-hidden="true">${overlay.decorative}</span></div></div>`
           + `<span class="feedback-status" data-overlay-status>`
           + `${active ? overlay.active : overlay.ready}</span></div>`;
      }
     if (name === 'Alert') {
       const urgent = variant === 'states';
       return `<div class="feedback-demo" data-feedback-alert><div class="feedback-alert `
         + `${variant === 'variants' ? 'success' : ''}">`
         + `<strong>${copy[variant].severity}</strong>`
         + `<p>${copy[variant].message}</p></div><span class="feedback-status"`
         + ` role="status" aria-live="polite"></span>${urgent ? `<button type="button" class="btn" data-alert-trigger>`
         + `${copy.urgent.trigger}</button><div class="feedback-alert error" data-alert-urgent hidden role="alert">`
         + `<strong>${copy.urgent.severity}</strong><p>${copy.urgent.message}</p></div>` : ''}</div>`;
     }
     if (name === 'Progress') {
       if (variant === 'variants') return `<div class="feedback-demo feedback-progress">`
         + `<label for="${id}">${copy.indeterminate.label}</label>`
         + `<progress id="${id}">${copy.indeterminate.loading}</progress>`
         + `<span class="feedback-status">${copy.indeterminate.loading}</span></div>`;
       const interactive = variant === 'states', initial = interactive ? 80 : 68;
       return `<div class="feedback-demo feedback-progress" data-progress-demo>`
         + `<label for="${id}">${copy.determinate.label}</label>`
         + `<progress id="${id}" max="100" value="${initial}"></progress>`
         + `<span class="feedback-status" data-progress-status>`
         + `${interactive ? copy.complete.statesValue : copy.determinate.value}</span>`
         + (interactive ? `<button type="button" class="btn" data-progress-advance>`
           + `${copy.complete.button}</button>` : '') + `</div>`;
     }
     return `<div class="feedback-demo" data-snackbar-demo>`
       + `<button type="button" class="btn" data-snackbar-trigger>${copy.trigger}</button>`
       + `<span class="feedback-status" data-snackbar-status role="status" aria-live="polite"></span>`
       + `<span class="feedback-status">${copy.ready}</span><div class="feedback-snackbar" data-snackbar hidden>`
       + `<span data-snackbar-message>${copy.message}</span><div class="actions">`
       + `<button type="button" class="btn ghost" data-snackbar-undo>${copy.undo}</button>`
       + `<button type="button" class="btn" data-snackbar-dismiss>${copy.dismiss}</button>`
       + `</div></div></div>`;
   }
   function wireFeedbackDemos() {
     document.querySelectorAll('[data-feedback-popover-demo]').forEach(root => {
       const trigger = root.querySelector('[data-popover-trigger]'), popover = root.querySelector('[popover]');
       const positionPopover = () => {
         if (!popover.matches(':popover-open')) return;
         popover.style.position = 'fixed'; popover.style.margin = '0'; popover.style.positionArea = 'none';
         const anchor = trigger.getBoundingClientRect(), surface = popover.getBoundingClientRect();
         const inset = 8, gap = 8, maxX = innerWidth - surface.width - inset;
         const left = Math.max(inset, Math.min(anchor.left, maxX));
         const below = anchor.bottom + gap, above = anchor.top - gap - surface.height;
         const top = below + surface.height <= innerHeight - inset ? below
           : above >= inset ? above : Math.max(inset, Math.min(below, innerHeight - surface.height - inset));
         popover.style.left = `${left}px`; popover.style.top = `${top}px`;
       };
       const sync = () => { const open = popover.matches(':popover-open');
         trigger.setAttribute('aria-expanded', String(open));
         root.querySelector('[data-popover-status]').textContent = open
           ? t('demo').feedback.popover.opened : t('demo').feedback.popover.closed; };
       popover.addEventListener('toggle', () => { sync(); positionPopover(); });
        if (popover.dataset.popoverInitialOpen === 'true') popover.showPopover(); else sync();
     });
     document.querySelectorAll('[data-feedback-tooltip-demo]').forEach(root => {
        const trigger = root.querySelector('[data-tooltip-trigger]'), tooltip = root.querySelector('[role="tooltip"]');
        let focused = false, hoveredTrigger = false, hoveredTooltip = false, dismissed = false;
        const sync = () => { const visible = !dismissed && (focused || hoveredTrigger || hoveredTooltip);
          tooltip.hidden = !visible;
          root.querySelector('[data-tooltip-status]').textContent = visible
            ? t('demo').feedback.tooltip.shown : t('demo').feedback.tooltip.hidden; };
        trigger.addEventListener('focus', () => { focused = true; dismissed = false; sync(); });
        trigger.addEventListener('blur', () => { focused = false; sync(); });
        trigger.addEventListener('pointerenter', () => { hoveredTrigger = true; dismissed = false; sync(); });
        trigger.addEventListener('pointerleave', event => { hoveredTrigger = false;
          if (event.relatedTarget !== tooltip) sync(); });
        tooltip.addEventListener('pointerenter', () => { hoveredTooltip = true; sync(); });
        tooltip.addEventListener('pointerleave', event => { hoveredTooltip = false;
          if (event.relatedTarget !== trigger) sync(); });
        trigger.addEventListener('keydown', event => { if (event.key === 'Escape') { dismissed = true; sync(); } });
        sync();
     });
     document.querySelectorAll('[data-feedback-alert]').forEach(root => {
       const trigger = root.querySelector('[data-alert-trigger]');
       trigger?.addEventListener('click', () => {
       root.querySelector('[data-alert-urgent]').hidden = false;
       });
     });
     document.querySelectorAll('[data-progress-demo]').forEach(root => {
       const advance = root.querySelector('[data-progress-advance]');
       advance?.addEventListener('click', () => {
       const progress = root.querySelector('progress'), status = root.querySelector('[data-progress-status]');
       const value = Math.min(100, Number(progress.value) + 20); progress.value = value;
       status.textContent = value === 100 ? t('demo').feedback.complete.value : `${value}%`;
       if (value === 100) advance.disabled = true;
       });
     });
     document.querySelectorAll('[data-snackbar-demo]').forEach(root => {
       const trigger = root.querySelector('[data-snackbar-trigger]'), bar = root.querySelector('[data-snackbar]');
       const hide = () => { bar.hidden = true; trigger.focus(); };
       trigger.onclick = () => {
         bar.hidden = false;
         root.querySelector('[data-snackbar-status]').textContent = t('demo').feedback.shown;
       };
       root.querySelector('[data-snackbar-dismiss]').onclick = hide;
       root.querySelector('[data-snackbar-undo]').onclick = () => {
         root.querySelector('[data-snackbar-message]').textContent = t('demo').feedback.reversed;
         root.querySelector('[data-snackbar-status]').textContent = t('demo').feedback.reversed; hide();
       };
     });
   }
   function feedbackSection(name, title, variant) {
     const detail = data.componentDetails?.[name], docs = variant === 'overview' && detail
       ? `<div class="foundation-detail"><strong>${t('component.anatomy')}</strong><p>${detail.anatomy}</p>`
         + `<strong>${t('component.usage')}</strong><p>${detail.usage}</p>`
         + `<strong>${t('component.sections.api')}</strong><p>${detail.api}</p>`
         + `<strong>${t('component.sections.accessibility')}</strong>`
         + `<p>${detail.accessibility}</p></div>` : '';
     return `<section class="card doc-section" id="doc-${variant}"><div class="card-body"><h2>${title}</h2>`
       + `<p>${esc(t('components.' + name))}</p><div class="demo">`
       + `${feedbackDemo(name, variant, t('demo'))}</div>${docs}</div></section>`;
   }
  let navigationInstance = 0;
    const navigationNames = new Set([
     'AppBar', 'Breadcrumbs', 'Carousel', 'Drawer', 'ExpansionPanels', 'List', 'Menu',
     'NavMenu', 'Pagination', 'Tabs', 'TreeView'
    ]);
   function disclosureLink(label, href, current = false) {
     return `<li><a href="${href}" style="display:inline-flex;align-items:center;min-height:40px;`
       + `padding:8px" ${current ? 'aria-current="page"' : ''}>${label}</a></li>`;
   }
   function appBarDemo(variant, d, n) {
     const navId = `${n}-navigation`, expanded = variant === 'states';
     return `<div class="navigation-demo" data-app-bar-demo><header class="fake-card row"`
       + ` style="justify-content:space-between;gap:12px;flex-wrap:wrap">`
       + `<div><strong>${icon('cloud')} Thiscloud</strong><span class="muted"> · ${d.appBarContext}</span></div>`
       + `<button type="button" class="btn" data-app-bar-toggle aria-expanded="${expanded}"`
       + ` aria-controls="${navId}">${d.appBarMenu}</button>`
       + `<nav id="${navId}" aria-label="${d.appBarNavigation}" ${expanded ? '' : 'hidden'}>`
       + `<ul class="demo-row" style="list-style:none;padding:0;margin:12px 0 0">`
       + `${disclosureLink(d.overview, '#explore', true)}`
       + `${disclosureLink(d.components, '#category/actions')}</ul></nav></header>`
       + `<div class="demo-row"><button type="button" class="btn ghost" data-app-bar-action>${d.appBarAction}</button>`
       + `<span data-app-bar-status aria-live="polite">${d.appBarReady}</span></div></div>`;
   }
   function drawerDemo(variant, d, n) {
     const modal = `${n}-modal`, opener = `${n}-open`, title = `${n}-title`;
     const links = `<nav aria-label="${d.drawerNavigation}"><ul style="list-style:none;padding:0;margin:0">`
       + `${disclosureLink(d.overview, '#explore', true)}`
       + `${disclosureLink(d.settings, '#guidance/customization')}</ul></nav>`;
     if (variant === 'overview') return `<div class="navigation-demo drawer-demo"><aside class="fake-card"`
       + ` aria-label="${d.persistent}">${links}</aside>`
       + `<section class="fake-card"><h3>${d.pageContent}</h3><p>${d.drawerPersistentHint}</p></section></div>`;
     return `<div class="navigation-demo drawer-demo" data-drawer-demo><button type="button"`
       + ` class="btn primary" id="${opener}" data-drawer-open>${d.drawerOpenButton}</button>`
       + `<dialog id="${modal}" aria-labelledby="${title}"><h3 id="${title}">${d.modal}</h3>${links}`
       + `<button type="button" class="btn" data-drawer-close>${d.drawerClose}</button></dialog>`
       + `<span data-drawer-status aria-live="polite">${variant === 'states' ? d.drawerClosed : d.drawerReady}</span>`
       + `</div>`;
   }
    function navMenuDemo(variant, d, n) {
     const group = `${n}-group`, expanded = variant !== 'states';
     return `<div class="navigation-demo" data-nav-menu-demo><nav aria-label="${d.siteNavigation}">`
       + `<ul style="list-style:none;padding:0;margin:0"><li><a href="#explore"`
       + ` aria-current="page" data-nav-link style="display:inline-flex;min-height:40px">${d.overview}</a></li>`
       + `<li><button type="button" class="btn ghost" data-nav-toggle aria-expanded="${expanded}"`
       + ` aria-controls="${group}">${d.components}</button>`
       + `<ul id="${group}" style="list-style:none;padding-left:20px" ${expanded ? '' : 'hidden'}>`
       + `<li>${disclosureLink(d.actions, '#component/button').slice(4)}`
       + `<li>${disclosureLink(d.icons, '#icons').slice(4)}</ul></li></ul></nav>`
        + `<span data-nav-status aria-live="polite">${d.navReady}</span></div>`;
    }
    function listDemo(variant, d, n) {
      const interactive = variant === 'states';
      const secondLine = variant !== 'overview';
      const rows = [
        [d.aurora, d.designSystem], [d.foundation, d.ready], [d.workspaceLabel, d.review]
      ].map(([label, detail], index) => {
        const body = `<span class="list-row"><span class="avatar" aria-hidden="true">`
          + `${label[0]}</span>`
          + `<span><strong>${label}</strong>${secondLine ? `<small>${detail}</small>` : ''}</span></span>`;
        return `<li>${interactive ? `<button type="button" data-list-item>`
          + `${body}</button>` : body}</li>`;
      }).join('');
      return `<div class="list-demo" data-list-demo><ul aria-label="${d.listLabel}">${rows}</ul>`
        + `<span data-list-status aria-live="polite">${interactive ? d.listReady : d.listStatic}</span></div>`;
    }
    function menuDemo(variant, d, n) {
      const menuId = `${n}-actions`, buttonId = `${n}-button`;
      const disabled = variant === 'states';
      const items = [[d.edit, 'edit'], [d.duplicate, 'content_copy'], [d.delete, 'delete']]
        .map(([label, glyph], i) =>
        `<li><button type="button" role="menuitem" data-menu-item${disabled && i === 2 ? ' disabled' : ''}>`
        + `${icon(glyph)} ${label}</button></li>`).join('');
      return `<div class="menu-demo" data-menu-demo><button type="button" class="btn primary"`
        + ` id="${buttonId}"`
        + ` aria-haspopup="menu" aria-expanded="false" aria-controls="${menuId}"`
        + ` data-menu-button>${d.menuButton}</button>`
        + `<ul id="${menuId}" role="menu" aria-labelledby="${buttonId}" hidden>${items}</ul>`
        + `<span data-menu-status aria-live="polite">${d.menuClosed}</span></div>`;
    }
    function treeDemo(variant, d, n) {
      const rootId = `${n}-components`, actionsId = `${n}-actions`;
      const rootOpen = variant !== 'states', actionsOpen = variant === 'variants';
      const item = (id, label, parent = false, open = false, selected = false) =>
        `<li role="treeitem" data-tree-item${parent ? ` aria-expanded="${open}" aria-controls="${id}-group"` : ''}`
        + ` aria-selected="${selected}" tabindex="${selected ? '0' : '-1'}">`
        + `${icon(parent ? (open ? 'expand_more' : 'chevron_right') : 'description')}`
        + ` <span>${label}</span>${parent ? `<ul id="${id}-group" role="group" ${open ? '' : 'hidden'}>` : ''}`;
      const close = parent => parent ? '</ul></li>' : '</li>';
      return `<div class="tree-demo" data-tree-demo><ul id="${n}-tree" role="tree"`
        + ` aria-label="${d.treeLabel}">`
        + item(rootId, d.components, true, rootOpen, true)
        + item(actionsId, d.actions, true, actionsOpen)
        + item(`${n}-button`, 'Button', false, false, false)
        + item(`${n}-button-fab`, 'ButtonFab', false, false, false) + close(false) + close(true)
        + close(true) + `</ul><span data-tree-status aria-live="polite">${d.treeReady}</span></div>`;
    }
   function carouselDemo(variant, d, n) {
     const labels = d.carouselSlides;
     const start = variant === 'states' ? labels.length - 1 : 0;
     const slides = labels.map((label, i) => `<div role="group" aria-roledescription="${esc(d.slideRoleDescription)}"`
       + ` aria-label="${d.slide} ${i + 1} ${d.of} ${labels.length}" data-carousel-slide`
       + ` ${i === start ? '' : 'hidden'}><strong>${label}</strong>`
       + `<p>${d.slideText.replace('{label}', label)}</p></div>`).join('');
     return `<section class="carousel-demo" data-carousel-demo data-carousel-index="${start}" role="region"`
       + ` aria-roledescription="${esc(d.carouselRoleDescription)}" aria-labelledby="${n}-label">`
       + `<h3 id="${n}-label">${d.carouselLabel}</h3>`
       + `<div class="carousel-slides">${slides}</div><div class="carousel-controls">`
       + `<button type="button" class="btn" data-carousel-prev aria-label="${d.previous}">${d.previous}</button>`
       + `<button type="button" class="btn" data-carousel-next aria-label="${d.next}">${d.next}</button></div>`
       + `<output data-carousel-status role="status" aria-live="polite">`
       + `${d.slide} ${start + 1} ${d.of} ${labels.length}</output></section>`;
   }
   function expansionPanelsDemo(variant, d, n) {
     const count = variant === 'variants' ? 1 : 3;
     const open = variant === 'states' ? [true, false, false] : [variant === 'overview', false, false];
     const disabled = variant === 'states' ? [false, false, true] : [];
     const panels = d.panelLabels.slice(0, count).map((label, i) => {
       const control = `${n}-panel-${i}`, expanded = open[i];
       return `<article><h3><button type="button" class="btn" data-panel-toggle aria-expanded="${expanded}"`
         + ` aria-controls="${control}" ${disabled[i] ? 'disabled' : ''}>${label}</button></h3>`
         + `<div id="${control}" class="panel-content" ${expanded ? '' : 'hidden'}>`
       + `${d.expansionPanelContent.replace('{label}', label)}</div>`;
     }).join('');
     const note = d[variant === 'variants' ? 'panelMultiple' : variant === 'states'
       ? 'panelStates' : 'panelIndependent'];
     return `<div class="panels-demo" data-panels-demo><p>${note}</p>${panels}</div>`;
   }
   function navigationDemo(name, variant, d) {
     const n = `${name.toLowerCase()}-${variant}-${++navigationInstance}`;
     if (name === 'AppBar') return appBarDemo(variant, d, n);
     if (name === 'Drawer') return drawerDemo(variant, d, n);
     if (name === 'NavMenu') return navMenuDemo(variant, d, n);
     if (name === 'Carousel') return carouselDemo(variant, d, n);
     if (name === 'ExpansionPanels') return expansionPanelsDemo(variant, d, n);
      if (name === 'List') return listDemo(variant, d, n);
      if (name === 'Menu') return menuDemo(variant, d, n);
      if (name === 'TreeView') return treeDemo(variant, d, n);
    if (name === 'Breadcrumbs') return [
      `<div class="navigation-demo" data-breadcrumb-demo><nav aria-label="${d.breadcrumbLabel}">`,
      `<ol class="breadcrumb-list"><li><a href="#explore">${d.home}</a></li>`,
      `<li><span class="breadcrumb-separator" aria-hidden="true">/</span>`,
      `<a href="#category/actions">${d.components}</a></li>`,
      `<li><span class="breadcrumb-separator" aria-hidden="true">/</span>`,
      `<a href="#component/breadcrumbs" aria-current="page">${d.current}</a></li></ol></nav>`,
      `<span aria-live="polite">${variant === 'states' ? d.currentState : d.breadcrumbHint}</span></div>`
    ].join('');
    if (name === 'Pagination') {
      const page = variant === 'states' ? 4 : 1;
      const pages = [1, 2, 3, 4].map(x => `<li><button type="button" data-page="${x}" `
        + `aria-label="${d.page} ${x}" aria-current="${x === page ? 'page' : 'false'}">${x}</button></li>`).join('');
      return [
        `<div class="navigation-demo" data-pagination-demo data-page="${page}">`,
        `<nav aria-label="${d.paginationLabel}">`,
        `<ol class="pagination-list"><li><button type="button" data-page-prev aria-label="${d.previous}" `,
        `${page === 1 ? 'disabled' : ''}>${d.previous}</button></li>${pages}<li>`,
        `<button type="button" data-page-next aria-label="${d.next}" ${page === 4 ? 'disabled' : ''}>`,
        `${d.next}</button></li></ol></nav>`,
        `<span data-page-status aria-live="polite">${d.pageStatus.replace('{page}', page)}</span></div>`
      ].join('');
    }
    const labels = [d.overview, d.activity, d.settings];
    const tabs = labels.map((label, i) => {
      const active = i === 0;
      const disabled = i === 2;
      return `<button type="button" role="tab" id="${n}-tab-${i}" aria-controls="${n}-panel-${i}" `
        + `aria-selected="${active}" tabindex="${active ? 0 : -1}" ${disabled ? 'disabled' : ''}>${label}</button>`;
    }).join('');
    const panels = labels.map((label, i) => `<section id="${n}-panel-${i}" role="tabpanel" `
      + `aria-labelledby="${n}-tab-${i}" ${i ? 'hidden' : ''}><strong>${label}</strong>`
      + `<p>${d.panelText.replace('{label}', label)}</p></section>`).join('');
    return `<div class="navigation-demo tabs-demo" data-tabs-demo><div role="tablist" `
      + `aria-label="${d.tabsLabel}">${tabs}</div>${panels}<span data-tab-status aria-live="polite">`
      + `${d.navigationSelected.replace('{label}', labels[0])}</span></div>`;
  }
  function navigationSection(name, title, variant) {
    const detail = data.componentDetails?.[name];
    const d = t('demo');
    const docs = variant === 'overview' && detail ? `<div class="foundation-detail">`
      + `<strong>${t('component.anatomy')}</strong><p>${detail.anatomy}</p>`
      + `<strong>${t('component.usage')}</strong><p>${detail.usage}</p>`
      + `<strong>${t('component.sections.api')}</strong><p>${detail.api}</p>`
      + `<strong>${t('component.sections.accessibility')}</strong><p>${detail.accessibility}</p></div>` : '';
    return `<section class="card doc-section" id="doc-${variant}"><div class="card-body">`
      + `<h2>${title}</h2><div class="demo">${navigationDemo(name, variant, d)}</div>${docs}</div></section>`;
  }
    function wireNavigationDemos() {
     document.querySelectorAll('[data-app-bar-demo]').forEach(root => {
       const toggle = root.querySelector('[data-app-bar-toggle]'),
         nav = root.querySelector(`#${toggle.getAttribute('aria-controls')}`);
       toggle.onclick = () => {
         const open = toggle.getAttribute('aria-expanded') !== 'true';
         toggle.setAttribute('aria-expanded', open); nav.hidden = !open;
       };
       root.querySelector('[data-app-bar-action]').onclick = () =>
         root.querySelector('[data-app-bar-status]').textContent = t('demo').appBarActivated;
       root.querySelectorAll('a').forEach(link => link.onclick = event => event.preventDefault());
     });
      document.querySelectorAll('[data-drawer-demo]').forEach(root => {
        const dialog = root.querySelector('dialog'), opener = root.querySelector('[data-drawer-open]');
        let invokingButton = null;
        const restoreFocus = () => {
          const target = invokingButton;
          if (target?.isConnected && !target.disabled) queueMicrotask(() => {
            if (!dialog.open) target.focus();
          });
        };
        const close = () => {
          if (dialog.open) dialog.close();
          root.querySelector('[data-drawer-status]').textContent = t('demo').drawerClosed;
        };
        opener.onclick = event => {
          invokingButton = event.currentTarget;
          dialog.showModal(); root.querySelector('[data-drawer-status]').textContent = t('demo').drawerOpened;
          dialog.querySelector('button, a')?.focus();
        };
       root.querySelector('[data-drawer-close]').onclick = close;
         dialog.addEventListener('close', () => {
           root.querySelector('[data-drawer-status]').textContent = t('demo').drawerClosed;
           restoreFocus();
         });
        dialog.addEventListener('keydown', event => {
          if (event.key !== 'Tab') return;
          const focusables = [...dialog.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )].filter(item => !item.matches(':disabled')
            && !item.closest('[hidden], [aria-hidden="true"]')
            && item.getClientRects().length);
          if (!focusables.length) return;
          const first = focusables[0], last = focusables[focusables.length - 1];
          if ((event.shiftKey && document.activeElement === first)
            || (!event.shiftKey && document.activeElement === last)) {
            event.preventDefault();
            (event.shiftKey ? last : first).focus();
          }
        });
        dialog.querySelectorAll('a').forEach(link => link.onclick = event => event.preventDefault());
      });
      document.querySelectorAll('[data-nav-menu-demo]').forEach(root => {
       const toggle = root.querySelector('[data-nav-toggle]'),
         group = root.querySelector(`#${toggle.getAttribute('aria-controls')}`);
       const setGroup = open => { toggle.setAttribute('aria-expanded', open); group.hidden = !open; };
       toggle.onclick = () => setGroup(toggle.getAttribute('aria-expanded') !== 'true');
       root.querySelectorAll('a').forEach(link => link.onclick = event => {
         event.preventDefault();
         root.querySelectorAll('a').forEach(item => item.removeAttribute('aria-current'));
         link.setAttribute('aria-current', 'page');
         root.querySelector('[data-nav-status]').textContent = t('demo').navSelected
           .replace('{label}', link.textContent);
       });
       root.addEventListener('keydown', event => {
         if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
           setGroup(false); toggle.focus();
         }
       });
     });
    document.querySelectorAll('[data-pagination-demo]').forEach(root => {
      const update = page => {
        root.dataset.page = page;
        root.querySelectorAll('[data-page]').forEach(button => button.setAttribute(
          'aria-current', Number(button.dataset.page) === page ? 'page' : 'false'));
        root.querySelector('[data-page-prev]').disabled = page === 1;
        root.querySelector('[data-page-next]').disabled = page === 4;
        root.querySelector('[data-page-status]').textContent = t('demo').pageStatus.replace('{page}', page);
      };
      root.querySelectorAll('[data-page]').forEach(button => button.onclick = () =>
        update(Number(button.dataset.page)));
      root.querySelector('[data-page-prev]').onclick = () => update(Number(root.dataset.page) - 1);
      root.querySelector('[data-page-next]').onclick = () => update(Number(root.dataset.page) + 1);
    });
    document.querySelectorAll('[data-tabs-demo]').forEach(root => {
      const tabs = [...root.querySelectorAll('[role="tab"]')];
      const activate = tab => {
        tabs.forEach(item => {
          const selected = item === tab;
          item.setAttribute('aria-selected', selected);
          item.tabIndex = selected ? 0 : -1;
          root.querySelector(`#${item.getAttribute('aria-controls')}`).hidden = !selected;
        });
        root.querySelector('[data-tab-status]').textContent = t('demo').navigationSelected
          .replace('{label}', tab.textContent);
      };
      tabs.forEach(tab => {
        tab.onclick = () => activate(tab);
        tab.onkeydown = event => {
          if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
          event.preventDefault();
          const enabled = tabs.filter(item => !item.disabled);
          const position = enabled.indexOf(tab);
          const next = event.key === 'Home' ? enabled[0] : event.key === 'End' ? enabled.at(-1)
            : enabled[(position + (event.key === 'ArrowRight' ? 1 : -1) + enabled.length) % enabled.length];
          next.focus();
          activate(next);
        };
      });
    });
      document.querySelectorAll('[data-list-demo]').forEach(root => {
        root.querySelectorAll('[data-list-item]').forEach(button => button.onclick = () => {
          root.querySelector('[data-list-status]').textContent = `${t('demo').listActivated}:`
            + ` ${button.textContent.trim()}`;
        });
      });
      document.querySelectorAll('[data-menu-demo]').forEach(root => {
        const button = root.querySelector('[data-menu-button]'), menu = root.querySelector('[role="menu"]');
        const items = () => [...menu.querySelectorAll('[role="menuitem"]')]
          .filter(item => !item.disabled);
        const close = () => {
          menu.hidden = true; button.setAttribute('aria-expanded', 'false'); button.focus();
        };
        const open = focusLast => {
          menu.hidden = false; button.setAttribute('aria-expanded', 'true');
          (focusLast ? items().at(-1) : items()[0])?.focus();
          root.querySelector('[data-menu-status]').textContent = t('demo').menuOpened;
        };
        button.onclick = () => button.getAttribute('aria-expanded') === 'true' ? close() : open(false);
        button.onkeydown = event => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault(); open(event.key === 'ArrowUp');
          }
        };
        menu.onkeydown = event => {
          const enabled = items(), current = enabled.indexOf(document.activeElement);
          if (event.key === 'Escape') { event.preventDefault(); close(); return; }
          if (event.key === 'Home' || event.key === 'End') {
            event.preventDefault();
            (event.key === 'Home' ? enabled[0] : enabled.at(-1))?.focus(); return;
          }
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            enabled[(current + (event.key === 'ArrowDown' ? 1 : -1) + enabled.length)
              % enabled.length]?.focus();
          }
        };
        items().forEach(item => item.onclick = () => {
          root.querySelector('[data-menu-status]').textContent = `${t('demo').menuActivated}:`
            + ` ${item.textContent.trim()}`;
          close();
        });
      });
     document.querySelectorAll('[data-tree-demo]').forEach(root => {
        const tree = root.querySelector('[role="tree"]'), status = root.querySelector('[data-tree-status]');
        const visible = () => [...tree.querySelectorAll('[role="treeitem"]')].filter(item => !item.closest('[hidden]'));
        const focus = item => {
          if (!item || !visible().includes(item)) return;
          visible().forEach(node => node.tabIndex = node === item ? 0 : -1);
          item.focus();
        };
        const select = item => {
          tree.querySelectorAll('[role="treeitem"]').forEach(node =>
            node.setAttribute('aria-selected', String(node === item)));
          focus(item); status.textContent = `${t('demo').treeSelected}: ${item.textContent.trim()}`;
        };
        const expand = (item, open) => {
          item.setAttribute('aria-expanded', String(open));
          const group = root.querySelector(`#${item.getAttribute('aria-controls')}`);
          if (group) group.hidden = !open;
          item.querySelector('.ms').textContent = open ? 'expand_more' : 'chevron_right';
        };
        tree.querySelectorAll('[role="treeitem"]').forEach(item => {
          item.onclick = () => select(item);
          item.onkeydown = event => {
            const nodes = visible(), index = nodes.indexOf(item);
            const parent = item.parentElement.closest('[role="treeitem"]');
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Home' || event.key === 'End') {
              event.preventDefault();
              const next = event.key === 'Home' ? nodes[0] : event.key === 'End' ? nodes.at(-1)
                : nodes[index + (event.key === 'ArrowDown' ? 1 : -1)];
              focus(next); return;
            }
            if (event.key === 'ArrowRight' && item.hasAttribute('aria-expanded')) {
              event.preventDefault();
              if (item.getAttribute('aria-expanded') === 'false') expand(item, true);
              else focus(visible().find(node => node.parentElement.closest('[role="treeitem"]') === item));
              return;
            }
            if (event.key === 'ArrowLeft') {
              event.preventDefault();
              if (item.getAttribute('aria-expanded') === 'true') expand(item, false);
              else focus(parent);
              return;
            }
            if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select(item); }
          };
         });
       });
       document.querySelectorAll('[data-carousel-demo]').forEach(root => {
         const slides = [...root.querySelectorAll('[data-carousel-slide]')];
         const status = root.querySelector('[data-carousel-status]');
         const update = index => {
           root.dataset.carouselIndex = index;
           slides.forEach((slide, i) => { slide.hidden = i !== index; });
           status.textContent = `${t('demo').slide} ${index + 1} ${t('demo').of} ${slides.length}`;
         };
         const move = delta => update((Number(root.dataset.carouselIndex) + delta + slides.length) % slides.length);
         root.querySelector('[data-carousel-prev]').onclick = () => move(-1);
         root.querySelector('[data-carousel-next]').onclick = () => move(1);
         update(Number(root.dataset.carouselIndex));
       });
       document.querySelectorAll('[data-panels-demo]').forEach(root => {
         root.querySelectorAll('[data-panel-toggle]').forEach(button => button.onclick = () => {
           const panel = root.querySelector(`#${button.getAttribute('aria-controls')}`);
           const open = button.getAttribute('aria-expanded') !== 'true';
           button.setAttribute('aria-expanded', String(open));
           panel.hidden = !open;
         });
       });
   }
  const surfaceNames = new Set(['Avatar', 'Badge', 'Card', 'Icons', 'Rating']);
  let surfaceInstance = 0;
  function surfaceDemo(name, variant) {
    const d = t('demo'), s = d.surface, id = `surface-${name.toLowerCase()}-${variant}-${++surfaceInstance}`;
    if (name === 'Avatar') return `<div class="surface-demo"><div class="surface-samples">`
      + `<span class="surface-avatar" role="img" aria-label="${s.personName}">${s.initials}</span>`
      + `<span class="surface-avatar decorative" aria-hidden="true">${s.initials}</span>`
      + `<span>${s.adjacent}</span>`
      + `<span class="surface-avatar-group" role="group" aria-label="${s.groupLabel}">`
      + `<span class="surface-avatar" aria-hidden="true">${s.initials}</span>`
      + `<span class="surface-avatar" aria-hidden="true">${s.teamInitials}</span></span>`
      + `</div><span class="surface-status">${variant === 'states' ? s.offline : s.online}</span>`
      + `</div>`;
     if (name === 'Icons') return `<div class="icon-demo"><div class="surface-samples">`
       + `<span class="icon-example">${icon('home')} ${s.iconDecorative}</span>`
       + `<span class="icon-example" role="img" aria-label="${s.iconMeaning}">`
       + `${icon('info')} ${s.iconMeaning}</span>`
       + `<button type="button" class="btn" aria-label="${s.iconControl}">`
       + `${icon('settings')} ${s.iconControl}</button>`
       + `</div><div class="icon-example">${variant === 'states' ? s.iconUnavailable : `
         ${icon('check_circle')} ${s.iconAvailable}`}</div></div>`;
    if (name === 'Badge') return `<div class="surface-demo"><div class="surface-samples">`
      + `<span class="pill production">${s.newLabel}</span><span class="pill info">${s.countLabel}: 3</span>`
      + (location.hash.startsWith('#component/badge') ? `<button type="button" class="btn"`
        + ` data-surface-badge>${s.add}</button>` : '')
      + `</div><span class="surface-status" `
      + (location.hash.startsWith('#component/badge') ? 'id="' + id
        + '-status" aria-live="polite"' : '') + `>${s.staticContext}</span></div>`;
     if (name === 'Rating') {
       const ratingId = `rating-${variant}-${++surfaceInstance}`;
       const selected = variant === 'states' ? 0 : variant === 'variants' ? 5 : 4;
       const disabled = variant === 'states';
       const radios = [1, 2, 3, 4, 5].map(value => `<label for="${ratingId}-${value}">`
         + `<input id="${ratingId}-${value}" type="radio" name="${ratingId}" value="${value}"`
         + `${selected === value ? ' checked' : ''}${disabled ? ' disabled' : ''}>`
         + `<span aria-hidden="true">${'★'.repeat(value)}${'☆'.repeat(5 - value)}</span>`
         + `<span class="sr-only">${s.ratingLabel.replace('{value}', value)}</span></label>`).join('');
       return `<div class="rating-demo" data-rating-demo><fieldset><legend>${s.ratingLegend}</legend>${radios}`
         + `</fieldset><output role="status" aria-live="polite" data-rating-status>${disabled ? s.ratingDisabled
         : s.ratingSelected.replace('{value}', selected)}</output><div class="icon-example">`
         + `<span aria-hidden="true">${'★'.repeat(4)}${'☆'}</span> `
         + `${s.ratingReadonly.replace('{value}', 4)}</div></div>`;
     }
    const state = variant === 'states' ? 'disabled' : variant === 'variants' ? 'elevated' : 'selected';
    return `<article class="surface-card ${state}"><h3>${s.cardTitle}</h3><p>${s.cardBody}</p>`
      + (location.hash.startsWith('#component/card') ? `<div class="actions"><button type="button"`
        + ` class="btn primary" data-surface-card ${state === 'disabled' ? 'disabled' : ''}>`
        + `${s.cardAction}</button></div>` : '')
      + `<span class="surface-status" ${location.hash.startsWith('#component/card') ? `id="${id}-status"`
        + ' aria-live="polite"' : ''}>${s.cardState[state]}</span></article>`;
  }
  function wireSurfaceDemos() {
    document.querySelectorAll('[data-surface-badge]').forEach(button => button.onclick = () => {
      button.closest('.surface-demo').querySelector('.surface-status').textContent = t('demo').surface.updated;
    });
    document.querySelectorAll('[data-surface-card]').forEach(button => button.onclick = event => {
      event.currentTarget.closest('.surface-card').querySelector('.surface-status').textContent =
        t('demo').surface.cardActivated;
    });
    document.querySelectorAll('[data-rating-demo]').forEach(root => {
      root.querySelectorAll('input[type="radio"]').forEach(input => input.onchange = event => {
        root.querySelector('[data-rating-status]').textContent = t('demo').surface.ratingSelected
          .replace('{value}', event.currentTarget.value);
      });
    });
  }
  function demo(name, variant = 'overview') {
   const d = t('demo');
   if (feedbackNames.has(name)) return feedbackDemo(name, variant, d);
   if (navigationNames.has(name)) return navigationDemo(name, variant, d);
    if (surfaceNames.has(name)) return surfaceDemo(name, variant);
    if (['BreakpointProvider','Container','Grid','Hidden'].includes(name)) return foundationDemo(name, variant, d);
    if (selectionInputNames.has(name)) return selectionInputDemo(name, variant);
     if (radioNames.has(name)) return radioDemo(variant);
      if (nativeInputNames.has(name)) return nativeInputDemo(name, variant);
      if (inputBatchTwoNames.has(name)) return inputBatchTwoDemo(name, variant);
   if (name === 'DataGrid') return renderDataGridDemo(variant);
   const labels = {
    Button: [d.continue, d.outlined, d.ghost, d.destructive],
    ButtonFab: [d.create, d.edit, d.disabled], ButtonGroup: [d.overview, d.activity, d.settings],
    IconButton: [d.favorite, d.edit, d.deleteUnavailable], ToggleIconButton: [d.offOn, d.selected], Toolbar: [d.edit, d.publish],
    TextField: [d.outlined, d.filled, d.prefix, d.suffix], Field: [d.label, d.helper, d.required], Form: [d.validate, d.required, d.disabled],
    Checkbox: [d.checked, d.unchecked, d.disabled], Radio: [d.environment, d.production, d.preview], Switch: [d.notifications, d.quiet, d.managed],
    Select: [d.single, d.multiple, d.searchable], Autocomplete: [d.local, d.remote, d.creatable], DatePicker: [d.calendar, d.range, d.month],
    TimePicker: [d.clock, d.keyboard, d.twentyFourHour], NumericField: [d.integer, d.decimal, d.stepped], Chips: [d.input, d.filter, d.assist], ChipSet: [d.singleSelect, d.multiSelect, d.dismissible],
    ColorPicker: [d.swatches, d.spectrum, d.hexInput], DropZone: [d.idle, d.accepting, d.rejecting], FileUpload: [d.single, d.multiple, d.progress], Slider: [d.continuous, d.discrete, d.range],
    BreakpointProvider: ['XS','SM','MD · active','LG','XL'], Container: [d.responsive, d.fixedWidth], Divider: [d.sectionOne, d.sectionTwo], Element: ['<article>', '<section>'], FocusTrap: [d.focusBoundary, d.first, d.last],
    Grid: ['1 × 4', '2 × 2', 'Responsive'], Hidden: [d.visible, d.hidden, d.resize], Highlighter: [d.match, d.highlight], Image: [d.cover, d.contain, d.fallback], Link: [d.internalLink, d.actionLink], Paper: ['Elevation 0','Elevation 2','Elevation 4'], ScrollToTop: [d.scrollable, d.top], Skeleton: [d.text, d.avatar, d.card], SwipeArea: [d.previous, d.swipeArea, d.next], Typography: [d.displayScale, d.bodyCopy, d.caption],
    AppBar: [d.prominent, d.standard, d.compact], Breadcrumbs: [d.home, d.components, name], Carousel: [d.slide + ' 1 ' + d.of + ' 4', d.slide + ' 2 ' + d.of + ' 4'], Drawer: [d.persistent, d.modal, d.rail], ExpansionPanels: [d.accountSettings, d.notifications], List: [d.singleLine, d.twoLine, d.interactive], Menu: [d.edit, d.duplicate, d.delete], NavMenu: [d.overview, d.components, d.icons], Pagination: ['1','2','3','12'], Tabs: [d.overview, d.activity, d.settings], TreeView: [d.components, d.actions, 'Button'],
    Avatar: ['TC','MD','A'], Badge: [d.new, d.count, d.label], Card: [d.outlined, d.elevated, d.interactive], Icons: ['home','search','settings','favorite','rocket_launch'], Rating: ['★★★★★','★★★★☆','★★★☆☆'],
    Alert: [d.deploymentReady, d.actionRequired, d.persistentMessage], Dialog: [d.confirmChanges, d.confirm, d.cancel], MessageBox: [d.info, d.question, d.danger], Overlay: [d.underlying, d.overlayActive], Popover: [d.top, d.bottom, d.auto], Progress: [d.uploading, '68%', d.indeterminate], Snackbar: [d.changesSaved, d.undo], Tooltip: [d.viewDetails, d.keyboard],
    DataGrid: [d.name, d.status, d.selected], Table: [d.name, d.status, d.empty], SimpleTable: [d.denseRow, d.compactData, d.ready], BarChart: [d.grouped, d.horizontal, d.stacked], DonutChart: [d.donut, d.gauge, d.legend], LineChart: [d.line, d.area, d.multiSeries], PieChart: [d.pie, d.donut, d.labels], StackedBarChart: [d.absolute, d.percent, d.horizontal], Timeline: [d.created, d.reviewing, d.published]
  };
  const text = labels[name] || [d.behaviorPreview, d.variantComparison, d.stateBoundary];
  if (['Button', 'ButtonFab', 'ButtonGroup'].includes(name)) return actionDemo(name, variant, d);
  if (name === 'IconButton' || name === 'ToggleIconButton') return `<div class="demo-row"><button class="icon-btn" aria-label="${d.favorite}">${icon('favorite')}</button><button class="icon-btn" aria-label="${d.edit}">${icon('edit')}</button><button class="icon-btn" disabled aria-label="${d.deleteUnavailable}">${icon('delete')}</button><span class="pill info">${text[0]}</span></div>`;
  if (name === 'Toolbar') return `<div class="fake-card row" style="justify-content:space-between"><strong>${d.editor}</strong><div class="actions"><button class="icon-btn">${icon('undo')}</button><button class="icon-btn">${icon('redo')}</button><button class="btn primary">${d.publish}</button></div></div>`;
  if (['TextField','Field','Form'].includes(name)) return `<div class="demo-row" style="align-items:end"><label>${d.projectName}<input placeholder="${d.enterValue}"></label><label>${d.outlined}<input placeholder="${d.searchProjects}"></label><span class="muted">${d.helper}</span>${name==='Form'?`<button class="btn primary">${d.validate}</button>`:''}</div>`;
  if (['Checkbox','Radio','Switch'].includes(name)) return `<div class="demo-row"><label><input type="${name==='Radio'?'radio':'checkbox'}" checked> ${text[0]}</label><label><input type="${name==='Radio'?'radio':'checkbox'}"> ${text[1]}</label><label><input type="${name==='Radio'?'radio':'checkbox'}" disabled> ${text[2]}</label></div>`;
  if (['Select','Autocomplete','DatePicker','TimePicker','NumericField'].includes(name)) return `<div class="demo-row"><label>${name}<select><option>${d.centerAurora}</option><option>${d.foundation}</option><option>${d.roadmap}</option></select></label><button class="btn">${icon('expand_more')} ${d.choose}</button><span class="pill info">${text.join(' · ')}</span></div>`;
  if (['Chips','ChipSet'].includes(name)) return `<div class="demo-row">${text.map((x,i)=>`<span class="pill ${i===0?'production':i===1?'info':''}">${x}</span>`).join('')}</div>`;
  if (name === 'ColorPicker') return `<div class="demo-row"><input type="color" value="#5946b2" aria-label="${d.brandColor}"><span class="pill">#5946B2</span><span class="pill">#42A5F5</span></div>`;
  if (['DropZone','FileUpload'].includes(name)) return `<div class="fake-card" style="border-style:dashed;text-align:center">${icon('upload_file')}<strong>${d.dropFiles}</strong><p>${d.fileTypes}</p><button class="btn primary">${d.chooseFile}</button></div>`;
  if (name === 'Slider') return `<div style="width:100%"><label>${d.volume} · 68<input type="range" min="0" max="100" value="68" style="width:100%"></label><div class="demo-row"><span>0</span><span class="pill info">68</span><span>100</span></div></div>`;
  if (name === 'Grid') return `<div><div class="wire">${[1,2,3,4].map((_,i)=>`<i style="height:${35+i*10}px;flex:${i%2+1}"></i>`).join('')}</div><span class="pill info">${d.responsive}</span></div>`;
  if (name === 'Container') return `<div style="width:100%;padding:12px;border:1px dashed var(--accent)"><div style="max-width:${variant==='variants'?'70%':'88%'};margin:auto;padding:18px;background:var(--brand);border-radius:6px;text-align:center">${text[variant==='variants'?1:0]}</div></div>`;
  if (name === 'Element') return `<div class="demo-row"><article class="fake-card"><strong>&lt;article&gt;</strong><p>${d.semanticSurface}</p></article><section class="fake-card"><strong>&lt;section&gt;</strong><p>${d.groupedContent}</p></section></div>`;
  if (name === 'FocusTrap') return `<div class="fake-card"><strong>${d.focusBoundary}</strong><p>${d.tabCycle}</p><input aria-label="${d.first}" value="${d.first}"><button class="btn primary">${d.last}</button></div>`;
  if (name === 'Typography') return `<div><h3>${d.displayScale}</h3><p>${d.bodyCopy}</p><small>${d.caption}</small></div>`;
  if (name === 'AppBar') return `<div class="fake-card row" style="justify-content:space-between"><strong>${icon('cloud')} Thiscloud</strong><div class="actions"><button class="icon-btn" aria-label="${d.search}">${icon('search')}</button><span class="avatar">MD</span></div></div>`;
  if (name === 'Breadcrumbs') return `<nav class="demo-row" aria-label="${t('mobile.breadcrumb')}"><a href="#explore">${d.home}</a><span>/</span><a href="#category/actions">${t('nav.components')}</a><span>/</span><strong>Button</strong></nav>`;
  if (name === 'Carousel') return `<div class="fake-card" style="text-align:center"><button class="icon-btn">${icon('chevron_left')}</button><strong>${text[variant==='states'?1:0]}</strong><button class="icon-btn">${icon('chevron_right')}</button><div>● ○ ○ ○</div></div>`;
  if (name === 'Drawer') return `<div class="fake-card row" style="align-items:stretch"><aside style="width:140px;border-right:1px solid var(--line)"><strong>${d.workspaceLabel}</strong><p class="pill production">${d.overview}</p><p>${d.settings}</p></aside><div><strong>${d.pageContent}</strong><p>${d.persistentNav}</p></div></div>`;
  if (name === 'ExpansionPanels') return `<div style="width:100%"><div class="fake-card"><strong>${icon('expand_less')} ${d.accountSettings}</strong><p>${d.expandedContent}</p></div><div class="fake-card"><strong>${icon('expand_more')} ${d.notifications}</strong></div></div>`;
  if (name === 'List') return `<div style="width:100%"><div class="row fake-card"><span class="avatar">A</span><div><strong>Aurora</strong><div>${d.designSystem}</div></div></div><div class="row fake-card"><span class="avatar">F</span><div><strong>${d.foundation}</strong><div>${d.ready}</div></div></div></div>`;
  if (name === 'Menu') return `<div class="fake-card" role="menu">${[d.edit,d.duplicate,d.delete].map((x,i)=>`<button class="btn ghost" role="menuitem">${icon(['edit','content_copy','delete'][i])} ${x}</button>`).join('')}</div>`;
  if (name === 'NavMenu' || name === 'Tabs') return `<nav class="fake-card demo-row">${text.map((x,i)=>`<a class="pill ${i===0?'production':''}" href="#${i===0?'explore':'component/button'}">${x}</a>`).join('')}</nav>`;
  if (name === 'Pagination') return `<div class="demo-row"><button class="icon-btn">${icon('chevron_left')}</button>${text.map((x,i)=>`<button class="btn ${i===0?'primary':''}">${x}</button>`).join('')}<button class="icon-btn">${icon('chevron_right')}</button></div>`;
  if (name === 'TreeView') return `<div><div>${icon('expand_more')} <strong>${d.components}</strong></div><div style="padding-left:24px">${icon('folder')} ${d.actions}</div><div style="padding-left:48px">${icon('description')} Button</div><div style="padding-left:48px">${icon('description')} ButtonFab</div></div>`;
  if (name === 'Avatar') return `<div class="demo-row">${text.map((x,i)=>`<span class="avatar" style="width:${36+i*12}px;height:${36+i*12}px">${x}</span>`).join('')}</div>`;
  if (name === 'Badge' || name === 'Rating') return `<div class="demo-row"><span class="pill production">${text[0]}</span><span class="muted">${text[1]}</span><span class="pill info">${text[2]}</span></div>`;
  if (name === 'Card') return `<div class="fake-card"><strong>${d.usageSummary}</strong><p>${d.boundedContent}</p><button class="btn primary">${d.view}</button></div>`;
  if (['Dialog','MessageBox','Popover'].includes(name)) return `<div class="fake-card"><strong>${text[0]}</strong><p>${variant==='states'?d.escapeCloses:d.focusedSurface}</p><button class="btn primary" data-dialog>${d.open} ${name}</button></div>`;
  if (name === 'Overlay') return `<div class="fake-card" style="position:relative;min-height:90px"><span>${d.underlying}</span><div style="position:absolute;inset:0;background:#000a;display:grid;place-items:center"><span class="pill production">${d.overlayActive}</span></div></div>`;
  if (name === 'Alert') return `<div class="fake-card" style="border-left:4px solid var(--accent)"><strong>${icon(variant==='states'?'error':'info')} ${text[variant==='states'?1:0]}</strong><p>${d.persistentMessage}</p></div>`;
  if (name === 'Snackbar') return `<div class="fake-card row" style="justify-content:space-between"><span>${icon('check')} ${d.changesSaved}</span><button class="btn ghost">${d.undo}</button></div>`;
  if (name === 'Tooltip') return `<div class="demo-row"><button class="icon-btn" aria-label="${d.viewDetails}">${icon('info')}</button><span class="pill" role="tooltip">${d.viewDetails}</span><span class="pill info">${d.keyboard}</span></div>`;
  if (name === 'Progress') return `<div style="width:100%"><div class="row" style="justify-content:space-between"><span>${d.uploading}</span><strong>68%</strong></div><div class="meter"><span></span></div><span class="pill info">${d.indeterminate}</span></div>`;
   if (name === 'SimpleTable' || name === 'Table') return passiveTableDemo(name, variant);
   if (name === 'Timeline') return timelineDemo(variant);
  if (['DataGrid','Table','SimpleTable'].includes(name)) return `<table><thead><tr><th>${d.name}</th><th>${d.status}</th></tr></thead><tbody><tr><td>${d.foundation}</td><td>${d.ready}</td></tr><tr><td>${d.navigation}</td><td>${d.review}</td></tr></tbody></table><div class="empty">${d.empty}</div>`;

  if (chartNames.has(name)) return chartDemo(name, text, d, variant);
  if (name === 'Timeline') return `<ol><li>${icon('check_circle')} <strong>${d.created}</strong> · 09:15</li><li>${icon('sync')} <strong>${d.reviewing}</strong> · now</li><li>${icon('radio_button_unchecked')} ${d.published}</li></ol>`;
  return `<div class="fake-card"><strong>${name}</strong><p>${text.join(' · ')}</p><div class="wire"><i style="height:42px"></i><i style="height:58px"></i><i style="height:46px"></i></div></div>`;
}

function actionDemo(name, variant, d) {
  const copy = t('actions')[name];
  const initialStatus = name === 'Toolbar' ? copy.toolbarReady : copy.ready;
  const id = `action-${name}-${variant}`;
  const button = (label, className = '', extra = '') =>
    `<button type="button" class="btn ${className}" data-action-button ${extra}>${label}</button>`;
  let controls;
   if (name === 'IconButton') {
     controls = [
       `<button type="button" class="icon-btn" data-action-button aria-label="${d.favorite}">`,
       icon('favorite'), '</button>',
       `<button type="button" class="icon-btn" data-action-button aria-label="${d.edit}">`,
       icon('edit'), '</button>',
       `<button type="button" class="icon-btn" data-action-button disabled`,
       ` aria-label="${d.deleteUnavailable}">${icon('delete')}</button>`
     ].join('');
   } else if (name === 'ToggleIconButton') {
     controls = [
       `<button type="button" class="icon-btn" data-toggle-icon aria-label="${d.pin}"`,
       ' aria-pressed="false">', icon('push_pin'), '</button>',
       `<output data-toggle-status>${d.off}</output>`
     ].join('');
   } else if (name === 'Toolbar') {
     controls = [
       `<div class="toolbar-demo" role="toolbar" aria-label="${d.toolbarLabel}"`,
       ' aria-orientation="horizontal">',
       `<button type="button" class="icon-btn" data-action-button aria-label="${d.toolbarUndoLabel}"`,
       ' tabindex="0">', icon('undo'), '</button>',
       `<button type="button" class="icon-btn" data-action-button aria-label="${d.redo}"`,
       ' tabindex="-1">', icon('redo'), '</button>',
       `<button type="button" class="btn primary" data-action-button aria-label="${d.publish}"`,
       ` tabindex="-1">${d.publish}</button>`,
       `<button type="button" class="icon-btn" data-action-button disabled`,
       ` aria-label="${d.deleteUnavailable}" tabindex="-1">${icon('delete')}</button></div>`
     ].join('');
   } else if (name === 'Button') {
    controls = variant === 'states'
      ? `${button(copy.primary, 'primary')}${button(copy.loading, 'ghost', 'disabled')}`
        + button(copy.disabled, '', 'disabled')
      : variant === 'variants'
        ? `${button(copy.primary, 'primary')}${button(copy.secondary)}`
          + `${button(copy.ghost, 'ghost')}${button(copy.destructive, 'danger')}`
        : `${button(copy.primary, 'primary')}${button(copy.secondary)}${button(copy.destructive, 'danger')}`;
  } else if (name === 'ButtonFab') {
    controls = variant === 'states'
      ? `<button type="button" class="fake-fab" aria-label="${copy.create}" data-action-button>${icon('add')}</button>`
        + `<button type="button" class="fake-fab" disabled aria-label="${copy.disabled}"`
          + ` data-action-button>${icon('block')}</button>`
      : `<button type="button" class="fake-fab" aria-label="${copy.create}" data-action-button>${icon('add')}</button>`
        + `<button type="button" class="fake-fab fill" aria-label="${copy.edit}"`
          + ` data-action-button>${icon('edit')}</button>`
        + `<button type="button" class="fake-fab extended" aria-label="${copy.create}"`
          + ` data-action-button>${icon('add')} ${copy.create}</button>`;
  } else {
    controls = `<fieldset class="button-group-demo" aria-describedby="${id}-status"><legend>${copy.groupName}</legend>`
      + [copy.overviewLabel, copy.activity, copy.settings].map((label, i) => button(label, i === 0 ? 'primary' : ''))
        .join('') + '</fieldset>';
   }
   return `<div class="action-demo" data-action-demo="${name}">${controls}`
     + `<output id="${id}-status" role="status">${initialStatus}</output></div>`;
}

function actionSection(name, title, variant) {
  const detail = data.componentDetails?.[name];
  const copy = t('actions')[name];
  const docs = variant === 'overview' && detail ? `<div class="foundation-detail">`
    + `<strong>${t('component.anatomy')}</strong><p>${detail.anatomy}</p>`
    + `<strong>${t('component.usage')}</strong><p>${detail.usage}</p>`
    + `<strong>${t('component.sections.api')}</strong><p>${detail.api}</p>`
    + `<strong>${t('component.sections.accessibility')}</strong><p>${detail.accessibility}</p></div>` : '';
  return `<section class="card doc-section" id="doc-${variant}"><div class="card-body"><h2>${title}</h2>`
    + `<p>${copy[variant]}</p><div class="demo">${actionDemo(name, variant, t('demo'))}</div>${docs}</div></section>`;
}

function wireActionDemos() {
  document.querySelectorAll('[data-action-demo]').forEach(root => {
    const copy = t('actions')[root.dataset.actionDemo];
    const status = root.querySelector('[role="status"]');
    root.querySelectorAll('[data-action-button]').forEach(button => {
      button.onclick = () => {
        status.textContent = `${copy.activated}: ${button.getAttribute('aria-label') || button.textContent.trim()}`;
      };
    });
    root.querySelector('[data-toggle-icon]')?.addEventListener('click', event => {
      const button = event.currentTarget;
      const pressed = button.getAttribute('aria-pressed') === 'true';
      button.setAttribute('aria-pressed', String(!pressed));
      root.querySelector('[data-toggle-status]').textContent = !pressed ? copy.on : copy.off;
    });
    root.querySelector('[role="toolbar"]')?.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      const enabled = [...event.currentTarget.querySelectorAll('button:not(:disabled)')];
      const current = enabled.indexOf(document.activeElement);
      if (current < 0) return;
      event.preventDefault();
      const step = event.key === 'ArrowRight' ? 1 : -1;
      enabled[(current + step + enabled.length) % enabled.length].focus();
    });
    root.querySelector('[role="toolbar"]')?.addEventListener('focusin', event => {
      const toolbar = event.currentTarget;
      if (!event.target.matches('button:not(:disabled)')) return;
      toolbar.querySelectorAll('button:not(:disabled)').forEach(button => {
        button.tabIndex = button === event.target ? 0 : -1;
      });
      status.textContent = `${copy.focused}: ${event.target.ariaLabel}`;
    });
  });
}
const chartNames = new Set(['BarChart', 'DonutChart', 'LineChart', 'PieChart', 'StackedBarChart']);

function chartLegend(labels) {
  const items = labels.map(label => `<span class="pill">${label}</span>`).join('');
  return `<div class="chart-legend" style="display:flex;flex-wrap:wrap;gap:6px">${items}</div>`;
}

function chartFrame(className, label, visual, stage, legend, model) {
  return [
    `<div class="chart-demo ${className}"><div role="img" aria-label="${label}">`, visual,
    `<p>${stage}</p>`,
    '</div>', legend, chartDataDisclosure(model),
    '</div>'
  ].join('');
}

function chartDataDisclosure(model) {
  const head = model.series ? [model.category, ...model.series,
    `${model.value} (${model.unit})`] : [model.category, `${model.value} (${model.unit})`];
  const rows = model.labels.map((label, i) => model.series
    ? `<tr><th scope="row">${label}</th>${model.values[i].map(value => `<td>${value}</td>`).join('')}`
      + `<td>${model.totals[i]}</td></tr>`
    : `<tr><th scope="row">${label}</th><td>${model.values[i]}</td></tr>`).join('');
  return `<details><summary>${model.summary}</summary><div class="chart-data-wrap">`
    + `<table><caption>${model.caption}</caption><thead><tr>`
    + `${head.map(label => `<th scope="col">${label}</th>`).join('')}</tr></thead>`
    + `<tbody>${rows}</tbody></table></div></details>`;
}

function barVisual(values, horizontal) {
  if (horizontal) {
    const rows = values.map((value, i) => [
      '<span style="display:grid;grid-template-columns:40px 1fr;align-items:center;gap:8px">',
      `<b>${i + 1}</b><i style="display:block;width:${value}%;height:14px;`,
      'background:var(--accent);border-radius:0 4px 4px 0"></i></span>'
    ].join('')).join('');
    return `<div class="bar-horizontal" style="display:grid;gap:6px" aria-hidden="true">${rows}</div>`;
  }
  const bars = values.map(height => [
    `<i style="height:${height}%;flex:1;background:var(--accent);`,
    'border-radius:4px 4px 0 0"></i>'
  ].join('')).join('');
  return `<div class="bar-set" style="display:flex;align-items:end;gap:8px;height:96px" `
    + `aria-hidden="true">${bars}</div>`;
}

function lineVisual(copy, variant, values) {
  const points = values.map((value, i) => `${[8, 62, 116, 170, 232][i]},${84 - value}`).join(' ');
  if (variant === 'variants') {
    return '<svg class="line-area" viewBox="0 0 240 90" style="width:100%;height:96px" aria-hidden="true">'
      + `<polygon points="${points} 232,84 8,84" `
      + 'fill="var(--accent)" opacity=".2" />'
      + `<polyline points="${points}" fill="none" stroke="var(--accent)" stroke-width="5" `
      + 'stroke-linecap="round" stroke-linejoin="round" /></svg>';
  }
  if (variant === 'states') {
    const statePoints = values.map((value, i) => `${[8, 62, 116, 170, 232][i]},`
      + `${42 - Math.round(value / 2)}`).join(' ');
    return `<div class="line-state" style="display:grid;gap:8px" aria-hidden="true">`
      + '<svg viewBox="0 0 240 42" style="width:100%;height:48px">'
      + `<polyline points="${statePoints}" fill="none" `
      + 'stroke="var(--muted)" stroke-width="4" stroke-dasharray="7 5" />'
      + `<circle cx="232" cy="${42 - Math.round(values[4] / 2)}" r="6" fill="var(--surface)" `
      + 'stroke="var(--muted)" stroke-width="3" /></svg>'
      + `<span class="pill">${esc(copy.stateLabel)}</span></div>`;
  }
  const markers = points.split(' ').map(point => {
    const [cx, cy] = point.split(',');
    return `<circle cx="${cx}" cy="${cy}" r="5" fill="var(--surface)" stroke="var(--accent)" stroke-width="3" />`;
  }).join('');
  return `<svg class="line-points" viewBox="0 0 240 90" style="width:100%;height:96px" aria-hidden="true">`
    + `<polyline points="${points}" fill="none" stroke="var(--accent)" stroke-width="5" `
    + `stroke-linecap="round" stroke-linejoin="round" />${markers}</svg>`;
}

function stackVisual(model) {
  const colors = ['var(--accent)', 'var(--brand)', 'var(--good)'];
  const bars = model.labels.map((label, rowIndex) => {
    const segments = model.values[rowIndex]
      .map((part, i) => `<i style="flex:${part};background:${colors[i]}"></i>`).join('');
    return `<div style="display:grid;grid-template-columns:52px 1fr 32px;align-items:center;gap:8px">`
      + `<b>${label}</b><span style="display:flex;height:24px;border-radius:6px;overflow:hidden">`
      + `${segments}</span><strong>${model.totals[rowIndex]}</strong></div>`;
  }).join('');
  return `<div class="stack-set" style="display:grid;gap:8px" aria-hidden="true">${bars}</div>`;
}

function chartDemo(name, text, d, variant) {
  const copy = t('charts.' + name);
  const model = t('chartData.' + name);
  const stage = variant === 'overview' ? copy.summary
    : variant === 'variants' ? copy.measure : copy.state;
  const legend = chartLegend(model.series || model.labels);
  if (name === 'BarChart') {
    const visual = barVisual(model.values, variant === 'variants');
    return chartFrame('chart-bars', esc(copy.aria), visual, stage, legend, model);
  }
  if (name === 'DonutChart') {
    const visual = [
      '<div class="donut-shape" style="width:92px;height:92px;border-radius:50%;',
       `background:conic-gradient(var(--accent) 0 ${model.values[0]}%,var(--brand) ${model.values[0]}% 100%);`,
      'display:grid;place-items:center;margin:auto" aria-hidden="true">',
       `<span style="background:var(--surface);border-radius:50%;padding:12px">${model.values[0]}%</span></div>`
    ].join('');
    return chartFrame('chart-donut', esc(copy.aria), visual, stage, legend, model);
  }
  if (name === 'LineChart') {
    const visual = lineVisual(copy, variant, model.values);
    return chartFrame('chart-line', esc(copy.aria), visual, stage, legend, model);
  }
  if (name === 'PieChart') {
    const visual = [
      '<div class="pie-shape" style="width:92px;height:92px;border-radius:50%;',
       `background:conic-gradient(var(--accent) 0 ${model.values[0]}%,`,
       `var(--brand) ${model.values[0]}% ${model.values[0] + model.values[1]}%,`,
       `var(--good) ${model.values[0] + model.values[1]}% 100%);margin:auto" aria-hidden="true"></div>`
    ].join('');
    return chartFrame('chart-pie', esc(copy.aria), visual, stage, legend, model);
  }
  return chartFrame('chart-stacked', esc(copy.aria), stackVisual(model), stage, legend, model);
}

const selectionInputNames = new Set(['Autocomplete', 'Select']);
const radioNames = new Set(['Radio']);
const nativeInputNames = new Set(['Checkbox', 'Switch', 'Slider', 'ColorPicker', 'DatePicker', 'TimePicker']);
const fieldNames = new Set(['Field', 'TextField', 'Form']);
let radioDemoId = 0;
let nativeInputDemoId = 0;
let fieldDemoId = 0;

function radioDemo(variant) {
  const copy = t('inputForms').radio;
  const id = `radio-${variant}-${++radioDemoId}`;
  const selected = variant === 'variants' ? 1 : variant === 'overview' ? 0 : -1;
  const fieldAttributes = variant === 'states'
    ? `aria-invalid="true" aria-describedby="${id}-error"`
    : '';
  const options = copy.options.map((option, index) => `<label class="radio-option">
    <input type="radio" id="${id}-${index}" name="${id}-group" value="${index}"
      ${index === selected ? ' checked' : ''}${variant === 'states' && index === 2 ? ' disabled' : ''}>
    <span>${option}</span>
  </label>`).join('');
  const initial = selected >= 0 ? `${copy.selected} ${copy.options[selected]}` : copy.none;
  return `<div class="radio-demo${variant === 'variants' ? ' radio-variants' : ''}" data-radio-demo>
  <fieldset ${fieldAttributes}>
    <legend>${copy.legend}</legend>${options}
  </fieldset>
  ${variant === 'states' ? `<p class="radio-error" id="${id}-error" role="alert">${copy.error}</p>` : ''}
  <output class="selection-status radio-status" data-radio-status role="status">${initial}</output>
</div>`;
}

function radioSection(name, title, variant) {
  const detail = data.componentDetails?.[name];
  const docs = variant === 'overview' && detail ? `<div class="foundation-detail">
    <strong>${t('component.anatomy')}</strong><p>${detail.anatomy}</p>
    <strong>${t('component.usage')}</strong><p>${detail.usage}</p>
    <strong>${t('component.sections.api')}</strong><p>${detail.api}</p>
    <strong>${t('component.sections.accessibility')}</strong><p>${detail.accessibility}</p>
  </div>` : '';
  return `<section class="card doc-section" id="doc-${variant}"><div class="card-body">
    <h2>${title}</h2><div class="demo">${radioDemo(variant)}</div>${docs}
  </div></section>`;
}

function wireRadioDemo() {
  document.querySelectorAll('[data-radio-demo]').forEach(root => {
    const copy = t('inputForms').radio;
    const fieldset = root.querySelector('fieldset');
    const status = root.querySelector('[data-radio-status]');
    root.querySelectorAll('input[type="radio"]').forEach(input => input.onchange = () => {
      const selected = root.querySelector('input[type="radio"]:checked');
      status.textContent = selected ? `${copy.selected} ${selected.nextElementSibling.textContent}` : copy.none;
      if (fieldset.getAttribute('aria-invalid') === 'true') {
        fieldset.removeAttribute('aria-invalid');
        fieldset.removeAttribute('aria-describedby');
        root.querySelector('.radio-error')?.setAttribute('hidden', '');
      }
    });
  });
}

function nativeInputDemo(name, variant) {
  if (['ColorPicker', 'DatePicker', 'TimePicker'].includes(name)) return specializedInputDemo(name, variant);
  const copy = t('inputForms')[name[0].toLowerCase() + name.slice(1)];
  const id = `native-${name.toLowerCase()}-${variant}-${++nativeInputDemoId}`;
  if (name === 'Checkbox') {
    const options = [copy.checked, copy.unchecked, copy.indeterminate, copy.disabled];
    return `<div class="boolean-demo" data-native-input="Checkbox"><fieldset>
      <legend>${copy.legend}</legend>${options.map((label, index) => `<label class="boolean-option">
        <input type="checkbox" id="${id}-${index}"${index === 0 ? ' checked' : ''}
          ${index === 2 ? ' data-indeterminate' : ''}${index === 3 ? ' disabled' : ''}>
        <span>${label}</span></label>`).join('')}
    </fieldset><output class="input-detail-status" data-native-status role="status">${copy.ready}</output></div>`;
  }
  if (name === 'Switch') {
    const control = (suffix, label, checked, size = 'medium', tone = 'primary', mode = '') => `<tc-switch class="tc-switch" id="${id}-${suffix}" name="${id}" label="${esc(label)}" size="${size}" tone="${tone}"${checked ? ' checked' : ''}${mode === 'disabled' ? ' disabled' : ''}${mode === 'readonly' ? ' readonly' : ''}></tc-switch>`;
    const controls = variant === 'states'
      ? control('readonly', copy.readonly, true, 'medium', 'primary', 'readonly') + control('disabled', copy.disabled, false, 'medium', 'primary', 'disabled')
      : control('small', copy.label, false, 'small') + control('medium', copy.primary, true) + control('large', copy.secondary, true, 'large', 'secondary');
    return `<div class="tc-switch-demo" data-native-input="Switch">${controls}<output class="input-detail-status" data-native-status
      role="status" aria-live="polite">${copy.off}</output></div>`;
  }
  const value = variant === 'variants' ? 50 : variant === 'states' ? 75 : 25;
  const disabled = variant === 'states' ? ' disabled' : '';
  return `<div class="range-demo" data-native-input="Slider"><label for="${id}">${copy.label}
    <input type="range" id="${id}" min="0" max="100" step="5" value="${value}"
      aria-describedby="${id}-output"${disabled}></label><output id="${id}-output"
      class="input-detail-status" data-native-status for="${id}" role="status">${value} ${copy.unit}</output></div>`;
}

function specializedInputDemo(name, variant) {
  const copy = t('inputForms')[name[0].toLowerCase() + name.slice(1)];
  const id = `native-${name.toLowerCase()}-${variant}-${++nativeInputDemoId}`;
  const type = name === 'ColorPicker' ? 'color' : name === 'DatePicker' ? 'date' : 'time';
  const settings = name === 'DatePicker'
    ? { value: variant === 'states' ? copy.invalidValue : copy.validValue, min: copy.min, max: copy.max, step: '' }
    : name === 'TimePicker'
      ? { value: variant === 'states' ? copy.invalidValue : copy.validValue, min: copy.min, max: copy.max,
        step: copy.step }
      : { value: variant === 'variants' ? copy.alternateValue : copy.defaultValue, min: '', max: '', step: '' };
  const attrs = [settings.min && `min="${settings.min}"`, settings.max && `max="${settings.max}"`,
    settings.step && `step="${settings.step}"`, name !== 'ColorPicker' && 'required'].filter(Boolean).join(' ');
    const field = (suffix, value, disabled = false, invalid = false) => {
    const fieldId = `${id}-${suffix}`;
    return `<div class="specialized-field" data-invalid="${invalid}"><label for="${fieldId}">`
      + `${copy.label}${suffix !== 'main' ? ` (${copy.stateInvalid})` : ''}
      <input id="${fieldId}" type="${type}" value="${value}" ${attrs}${disabled ? ' disabled' : ''}>
      ${name === 'ColorPicker' ? `<span class="demo-row"><span data-swatch role="img"`
        + ` aria-label="${copy.swatch}"></span><output data-value></output></span>` : ''}
      <output class="input-detail-status" data-status role="status" aria-live="polite"></output></label></div>`;
  };
  const fields = variant === 'states' && name !== 'ColorPicker'
    ? field('main', settings.value, false, true) + field('disabled', copy.disabledValue, true)
    : field('main', settings.value, variant === 'states');
  return `<div class="specialized-input-demo" data-specialized-input="${name}">${fields}`
    + `<p class="input-detail-status">${copy.note}</p></div>`;
}

function nativeInputSection(name, title, variant) {
  const detail = data.componentDetails?.[name];
  const docs = variant === 'overview' && detail ? `<div class="foundation-detail">
    <strong>${t('component.anatomy')}</strong><p>${detail.anatomy}</p>
    <strong>${t('component.usage')}</strong><p>${detail.usage}</p>
    <strong>${t('component.sections.api')}</strong><p>${detail.api}</p>
    <strong>${t('component.sections.accessibility')}</strong><p>${detail.accessibility}</p></div>` : '';
  return `<section class="card doc-section" id="doc-${variant}"><div class="card-body">
    <h2>${title}</h2><p>${t('components.' + name)}</p><div class="demo">${nativeInputDemo(name, variant)}</div>${docs}
  </div></section>`;
}

function wireNativeInputs() {
  document.querySelectorAll('[data-native-input], [data-specialized-input]').forEach(root => {
    const name = root.dataset.nativeInput || root.dataset.specializedInput;
    const copy = t('inputForms')[name[0].toLowerCase() + name.slice(1)];
    root.querySelectorAll('input').forEach(input => {
      if (input.hasAttribute('data-indeterminate')) input.indeterminate = true;
    });
    const status = root.querySelector('[data-native-status]');
    if (root.dataset.specializedInput) {
      root.querySelectorAll('input').forEach(input => {
        const field = input.closest('.specialized-field');
        const update = () => {
          const fieldStatus = field.querySelector('[data-status]');
          const valid = input.checkValidity();
          fieldStatus.textContent = input.disabled ? copy.disabled
            : valid ? `${copy.normalized}: ${input.value}` : copy.invalid;
          fieldStatus.dataset.invalid = String(!valid && !input.disabled);
          const value = field.querySelector('[data-value]');
          const swatch = field.querySelector('[data-swatch]');
          if (value) value.textContent = input.value;
          if (swatch) { swatch.style.backgroundColor = input.value;
            swatch.setAttribute('aria-label', `${copy.swatch}: ${input.value}`); }
        };
        input.oninput = update;
        input.onchange = update;
        update();
      });
      return;
    }
    if (name === 'Checkbox') root.querySelectorAll('input').forEach(input => input.onchange = () => {
      status.textContent = `${input.nextElementSibling.textContent}: ${input.checked ? copy.on : copy.off}`;
    });
    if (name === 'Switch') root.querySelectorAll('tc-switch').forEach(control => {
      const update = () => { status.textContent = control.checked ? copy.on : copy.off; };
      control.addEventListener('change', update);
    });
    if (name === 'Slider') root.querySelector('input').oninput = event => {
      status.textContent = `${event.currentTarget.value} ${copy.unit}`;
    };
  });
}

function textFieldMarkup(copy, id, label, variant, value = '', attributes = '', message = '', clearable = false) {
  const type = attributes.includes('type="email"') ? 'email' : 'text';
  const name = attributes.match(/name="([^"]+)"/)?.[1] || '';
  const required = attributes.includes('required') ? ' required' : '';
  const readonly = attributes.includes('readonly') ? ' readonly' : '';
  const disabled = attributes.includes('disabled') ? ' disabled' : '';
  const autocomplete = attributes.match(/autocomplete="([^"]+)"/)?.[1] || '';
  const shared = attributes.includes('data-shared-text') ? ' data-shared-text' : '';
  return `<tc-text-field id="${id}" variant="${variant}" type="${type}" label="${esc(label)}"
    helper="${esc(message)}" value="${esc(value)}"${name ? ` name="${esc(name)}"` : ''}${autocomplete ? ` autocomplete="${esc(autocomplete)}"` : ''}${shared}${required}${readonly}${disabled}
    ${clearable ? `clearable clear-label="${esc(copy.textField.clear)}"` : ''}
    required-message="${esc(copy.form.requiredError)}" type-mismatch-message="${esc(copy.textField.emailError)}"></tc-text-field>`;
}

function fieldDemo(name, variant) {
  const copy = t('inputForms');
  const id = `field-${++fieldDemoId}`;
  if (name === 'Field') {
    const state = variant === 'states';
    if (variant === 'variants') return `<div class="field-demo" data-field-demo>
      <div class="field-variant"><span class="field-variant-label">${copy.field.variants.standard}</span>${textFieldMarkup(copy, `${id}-standard`, copy.field.requiredLabel, 'standard', '', 'required', copy.field.requiredHint)}</div>
      <div class="field-variant"><span class="field-variant-label">${copy.field.variants.outlined}</span>${textFieldMarkup(copy, `${id}-outlined`, copy.field.optionalLabel, 'outlined', '', '', copy.field.optionalHint)}</div>
      <div class="field-variant"><span class="field-variant-label">${copy.field.variants.filled}</span>${textFieldMarkup(copy, `${id}-filled`, copy.field.validLabel, 'filled', copy.field.validValue, '', copy.field.validHint)}</div>
    </div>`;
    return `<div class="field-demo" data-field-demo>
      ${textFieldMarkup(copy, `${id}-required`, copy.field.requiredLabel, 'outlined', '', 'required', copy.field.requiredHint)}
      ${textFieldMarkup(copy, `${id}-optional`, copy.field.optionalLabel, 'outlined', '', '', copy.field.optionalHint)}
      ${textFieldMarkup(copy, `${id}-valid`, copy.field.validLabel, 'outlined', copy.field.validValue, '', copy.field.validHint)}
      ${state ? textFieldMarkup(copy, `${id}-readonly`, copy.field.readonlyLabel, 'outlined', copy.field.readonlyValue, 'readonly', copy.field.readonlyHint)
        + textFieldMarkup(copy, `${id}-disabled`, copy.field.disabledLabel, 'outlined', '', 'disabled', copy.field.disabledHint) : ''}
    </div>`;
  }
  if (name === 'TextField') {
    const state = variant === 'states';
    return `<div class="field-demo" data-text-field-demo>
      ${textFieldMarkup(copy, `${id}-standard`, copy.textField.standardLabel, 'standard', '', 'type="text" autocomplete="organization" data-shared-text', copy.textField.textHint, true)}
      ${textFieldMarkup(copy, `${id}-filled`, copy.textField.filledLabel, 'filled', variant === 'variants' ? copy.textField.filledValue : '', 'type="text" autocomplete="organization" data-shared-text', copy.textField.textHint, true)}
      ${textFieldMarkup(copy, `${id}-outlined`, copy.textField.outlinedLabel, 'outlined', '', 'type="text" autocomplete="organization" data-shared-text', copy.textField.textHint, true)}
      ${textFieldMarkup(copy, `${id}-email`, copy.textField.emailLabel, 'outlined', state ? 'not-an-email' : '', `type="email" autocomplete="email" required${state ? ' aria-invalid="true"' : ''}`, state ? copy.textField.emailError : copy.textField.emailHint)}
      ${state ? textFieldMarkup(copy, `${id}-readonly`, copy.textField.readonlyLabel, 'filled', copy.textField.readonlyValue, 'type="text" autocomplete="off" readonly', copy.textField.readonlyHint)
        + textFieldMarkup(copy, `${id}-disabled`, copy.textField.disabledLabel, 'outlined', '', 'type="text" autocomplete="off" disabled', copy.textField.disabledHint) : ''}
    </div>`;
  }
  return `<form class="form-demo" data-form-demo novalidate>
    <div data-form-fields>${textFieldMarkup(copy, `${id}-name`, copy.form.nameLabel, 'outlined', '',
      'type="text" name="projectName" autocomplete="organization" required', copy.form.nameHint)}
    ${textFieldMarkup(copy, `${id}-email`, copy.form.emailLabel, 'outlined', variant === 'states' ? 'invalid-email' : '',
      'type="email" name="email" autocomplete="email" required', copy.form.emailHint)}
    <tc-switch name="updates" label="${esc(copy.form.updatesLabel)}" required required-message="${esc(copy.form.updatesError)}"></tc-switch></div>
    <div class="actions"><button type="submit" class="btn primary">${copy.form.submit}</button>
      <button type="submit" class="btn" formnovalidate>${copy.form.submitWithoutValidation}</button>
      <button type="reset" class="btn">${copy.form.reset}</button></div>
    <p class="form-summary" data-form-summary role="status" aria-live="polite" hidden></p>
  </form>`;
}

function fieldSection(name, title, variant) {
  const detail = data.componentDetails?.[name];
  const docs = variant === 'overview' && detail ? `<div class="foundation-detail">
    <strong>${t('component.anatomy')}</strong><p>${detail.anatomy}</p>
    <strong>${t('component.usage')}</strong><p>${detail.usage}</p>
    <strong>${t('component.sections.api')}</strong><p>${detail.api}</p>
    <strong>${t('component.sections.accessibility')}</strong><p>${detail.accessibility}</p></div>` : '';
  return `<section class="card doc-section" id="doc-${variant}"><div class="card-body"><h2>${title}</h2>
    <p>${t('components.' + name)}</p><div class="demo">${fieldDemo(name, variant)}</div>${docs}</div></section>`;
}

const formValidationHandles = new Set();
function disposeFormValidationHandles() {
  formValidationHandles.forEach((handle) => handle.dispose());
  formValidationHandles.clear();
}

function renderFieldFormApiBadges() {
  const name = document.querySelector('.page-head > h1')?.textContent;
  if (name !== 'Field' && name !== 'Form') return;
  const { identity: signature, boundary } = publicWebApi[name];
  const badges = document.querySelector('.page-head > .row');
  const api = document.querySelector('#doc-api .card-body > p');
  badges?.querySelectorAll('.pill').forEach((badge, index) => {
    if (index === 0) badge.textContent = signature;
    if (index === 1) badge.textContent = boundary;
  });
  if (api) api.innerHTML = `<code>${esc(signature)}</code> · <span class="pill info">${esc(boundary)}</span>`;
}

const catalogRender = render;
const catalogShowLocaleError = showLocaleError;
render = () => { disposeFormValidationHandles(); catalogRender(); renderFieldFormApiBadges(); };
showLocaleError = (requested) => { disposeFormValidationHandles(); catalogShowLocaleError(requested); };
window.render = render;

function wireFieldDemos() {
  document.querySelectorAll('[data-text-field-demo]').forEach(root => {
    root.querySelectorAll('tc-text-field[data-shared-text]').forEach(field => field.addEventListener('input', event => {
      root.querySelectorAll('tc-text-field[data-shared-text]').forEach(peer => {
        if (peer !== event.currentTarget) peer.value = event.currentTarget.value;
      });
    }));
  });
  document.querySelectorAll('[data-form-demo]').forEach(form => {
    const copy = t('inputForms').form;
    const summary = form.querySelector('[data-form-summary]');
    formValidationHandles.add(ThiscloudUiWeb.attachFormValidation(form, {
      preventDefault: true,
      onInvalid: ({ invalidControls }) => {
        summary.hidden = false; summary.dataset.invalid = 'true';
        summary.textContent = `${copy.summary} ${invalidControls.length}`;
      },
      onValid: () => {
        summary.hidden = false; summary.dataset.invalid = 'false'; summary.textContent = copy.success;
      },
      onSkipped: () => {
        summary.hidden = false; summary.dataset.invalid = 'false'; summary.textContent = copy.skipped;
      },
      onReset: () => { summary.hidden = true; summary.textContent = ''; },
    }));
  });
}

function selectionOptionMarkup(option, index, id) {
  return `<li><button type="button" id="${id}-option-${index}" role="option" aria-selected="false">`
    + `${esc(option)}</button></li>`;
}

function selectionListMarkup(copy, id, variant) {
  const value = variant === 'states' ? 'Unknown' : variant === 'variants' ? 'C' : '';
  return `<div class="selection-demo" data-selection-demo="Autocomplete">
  <label class="selection-field"><span>${copy.label}</span>
    <input id="${id}" data-selection-input value="${value}"
      placeholder="${copy.placeholder}" role="combobox" aria-controls="${id}-list"
      aria-expanded="true" autocomplete="off">
  </label>
  <ul class="selection-list" id="${id}-list" data-selection-list role="listbox"></ul>
  <output class="selection-status" data-selection-status role="status"></output>
</div>`;
}

function selectInputMarkup(copy, id, variant) {
  const choices = copy.options.map((option, index) =>
    `<option value="${index}">${esc(option)}</option>`).join('');
  const options = variant === 'variants'
    ? `<optgroup label="${copy.group}">${choices}</optgroup>`
    : `<option value="">${copy.choose}</option>${choices}`;
  const attributes = variant === 'variants'
    ? 'multiple size="3"'
    : variant === 'states' ? 'disabled aria-invalid="true"' : '';
  const state = variant === 'states' ? copy.disabled : copy.none;
  return `<div class="selection-demo" data-selection-demo="Select">
  <label class="selection-field"><span>${copy.label}</span>
    <select id="${id}" data-select-input ${attributes} aria-describedby="${id}-status">
      ${options}
    </select>
  </label>
  <output class="selection-status" id="${id}-status" data-selection-status role="status">
    ${state}
  </output>
</div>`;
}

function selectionInputDemo(name, variant) {
  const copy = t('selectionInputs');
  const id = `selection-${name}-${variant}`;
  return name === 'Autocomplete'
    ? selectionListMarkup(copy, id, variant)
    : selectInputMarkup(copy, id, variant);
}

function selectionInputSection(name, title, variant) {
  const detail = data.componentDetails?.[name];
  const docs = variant === 'overview' && detail ? [
    '<div class="foundation-detail">',
    `<strong>${t('component.anatomy')}</strong><p>${detail.anatomy}</p>`,
    `<strong>${t('component.usage')}</strong><p>${detail.usage}</p>`,
    `<strong>${t('component.sections.api')}</strong><p>${detail.api}</p>`,
    `<strong>${t('component.sections.accessibility')}</strong>`,
    `<p>${detail.accessibility}</p>`,
    '</div>'
  ].join('') : '';
  return [
    `<section class="card doc-section" id="doc-${variant}">`,
    '<div class="card-body">',
    `<h2>${title}</h2>`,
    `<div class="demo">${selectionInputDemo(name, variant)}</div>`,
    docs,
    '</div></section>'
  ].join('');
}

function drawSelectionOptions(root, copy) {
  const input = root.querySelector('[data-selection-input]');
  const list = root.querySelector('[data-selection-list]');
  const status = root.querySelector('[data-selection-status]');
  const id = list.id.replace(/-list$/, '');
  const query = input.value.trim().toLowerCase();
  const matches = copy.options.filter(option => option.toLowerCase().includes(query));
  list.innerHTML = matches.map((option, index) => selectionOptionMarkup(option, index, id)).join('')
    || `<li class="empty">${copy.noResults}</li>`;
  status.textContent = matches.length ? `${matches.length} ${copy.matches}` : copy.noResults;
  list.querySelectorAll('[role="option"]').forEach(option => {
    option.onclick = () => selectSelectionOption(root, option);
  });
  root.dataset.activeIndex = '-1';
  input.removeAttribute('aria-activedescendant');
}

function closeSelectionList(root) {
  const input = root.querySelector('[data-selection-input]');
  const list = root.querySelector('[data-selection-list]');
  input.setAttribute('aria-expanded', 'false');
  input.removeAttribute('aria-activedescendant');
  list.hidden = true;
  root.dataset.activeIndex = '-1';
}

function selectSelectionOption(root, option) {
  const input = root.querySelector('[data-selection-input]');
  const status = root.querySelector('[data-selection-status]');
  input.value = option.textContent;
  status.textContent = `${t('selectionInputs').selected} ${option.textContent}`;
  closeSelectionList(root);
}

function moveSelection(root, delta) {
  const input = root.querySelector('[data-selection-input]');
  const options = [...root.querySelectorAll('[role="option"]')];
  if (!options.length) return;
  const current = Number(root.dataset.activeIndex);
  const next = (current + delta + options.length) % options.length;
  root.dataset.activeIndex = String(next);
  options.forEach((option, index) => option.setAttribute('aria-selected', String(index === next)));
  input.setAttribute('aria-activedescendant', options[next].id);
}

function wireSelectionList(root, copy) {
  const input = root.querySelector('[data-selection-input]');
  input.oninput = () => {
    input.setAttribute('aria-expanded', 'true');
    root.querySelector('[data-selection-list]').hidden = false;
    drawSelectionOptions(root, copy);
  };
  input.onkeydown = event => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      moveSelection(root, event.key === 'ArrowDown' ? 1 : -1);
    } else if (event.key === 'Enter') {
      const active = root.querySelector('[aria-selected="true"]');
      if (active) { event.preventDefault(); selectSelectionOption(root, active); }
    } else if (event.key === 'Escape') {
      closeSelectionList(root);
    }
  };
  drawSelectionOptions(root, copy);
}

function wireNativeSelect(root, copy) {
  const select = root.querySelector('[data-select-input]');
  const status = root.querySelector('[data-selection-status]');
  select.onchange = () => {
    const values = [...select.selectedOptions].map(option => option.textContent);
    status.textContent = values.length ? `${copy.selected} ${values.join(', ')}` : copy.none;
  };
}

function wireSelectionInputs() {
  const copy = t('selectionInputs');
  document.querySelectorAll('[data-selection-demo="Autocomplete"]').forEach(root => {
    wireSelectionList(root, copy);
  });
  document.querySelectorAll('[data-selection-demo="Select"]').forEach(root => {
    wireNativeSelect(root, copy);
  });
}

const inputBatchTwoNames = new Set(['Chips', 'ChipSet', 'NumericField']);
const uploadNames = new Set(['DropZone', 'FileUpload']);

function uploadDemo(name, variant) {
  const copy = t('inputForms').upload;
  const id = `upload-${name}-${variant}`;
  const multiple = name === 'DropZone' ? variant !== 'variants' : variant === 'variants';
  const disabled = variant === 'states';
  const accept = variant === 'variants' ? copy.singleAccept : copy.accept;
  const prompt = name === 'DropZone' ? copy.dropPrompt : copy.filePrompt;
  const rejection = variant === 'states'
    ? `<p class="upload-error" role="alert">${copy.rejectedState}</p>` : '';
  return `<div class="upload-demo" data-upload-demo="${name}" data-variant="${variant}">
    <label class="upload-zone" data-upload-zone data-disabled="${disabled}">
      <span class="ms" aria-hidden="true">${name === 'DropZone' ? 'upload_file' : 'file_upload'}</span>
      <strong>${prompt}</strong><span class="muted">${copy.policy}</span>
      <input id="${id}" type="file" accept="${accept}"${multiple ? ' multiple' : ''}
        ${disabled ? ' disabled' : ''} aria-describedby="${id}-status">
    </label>
    ${rejection}<ul class="upload-list" data-upload-list aria-label="${copy.selectedFiles}"></ul>
    <div class="actions"><button type="button" class="btn" data-upload-clear
      ${disabled ? ' disabled' : ''}>${copy.clear}</button></div>
    <output class="upload-status" id="${id}-status" data-upload-status role="status"
      aria-live="polite" aria-atomic="true">${copy.empty}</output>
  </div>`;
}

function uploadSection(name, title, variant) {
  const detail = data.componentDetails?.[name];
  const docs = variant === 'overview' && detail ? `<div class="foundation-detail">
    <strong>${t('component.anatomy')}</strong><p>${detail.anatomy}</p>
    <strong>${t('component.usage')}</strong><p>${detail.usage}</p>
    <strong>${t('component.sections.api')}</strong><p>${detail.api}</p>
    <strong>${t('component.sections.accessibility')}</strong><p>${detail.accessibility}</p>
  </div>` : '';
  return `<section class="card doc-section" id="doc-${variant}"><div class="card-body">
    <h2>${title}</h2><div class="demo">${uploadDemo(name, variant)}</div>${docs}
  </div></section>`;
}

function uploadFileError(file, copy, multiple) {
  const extension = file.name.toLowerCase().split('.').pop();
  const extensions = ['png', 'jpg', 'jpeg', 'pdf'];
  const knownType = copy.mime.includes(file.type);
  if (file.type ? !knownType : !extensions.includes(extension)) return copy.typeError;
  if (file.size > copy.maxBytes) return copy.sizeError;
  return '';
}

function renderUploadFiles(root, files, copy) {
  const list = root.querySelector('[data-upload-list]');
  list.replaceChildren();
  files.forEach((file, index) => {
    const item = document.createElement('li');
    item.className = 'upload-item';
    const metadata = document.createElement('span');
    metadata.textContent = `${file.name} · ${file.type || copy.unknownType} · ${file.size} B`;
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'btn';
    remove.textContent = copy.remove;
    remove.setAttribute('aria-label', `${copy.remove} ${file.name}`);
    remove.onclick = () => {
      files.splice(index, 1);
      renderUploadFiles(root, files, copy);
      root.querySelector('[data-upload-status]').textContent = files.length
        ? `${copy.selected}: ${files.length}` : copy.empty;
    };
    item.append(metadata, remove);
    list.append(item);
  });
}

function wireUploadDemo(root) {
  const copy = t('inputForms').upload;
  const input = root.querySelector('input[type="file"]');
  const zone = root.querySelector('[data-upload-zone]');
  const status = root.querySelector('[data-upload-status]');
  const files = [];
  const multiple = input.hasAttribute('multiple');
  const acceptFiles = incoming => {
    const candidates = [...incoming];
    const limit = multiple ? copy.maxFiles : 1;
    const error = candidates.map(file => uploadFileError(file, copy, multiple)).find(Boolean);
    if (error || candidates.length > limit) {
      status.textContent = error || copy.countError;
      status.dataset.invalid = 'true';
      return;
    }
    files.splice(0, files.length, ...candidates.slice(0, limit).map(file => ({
      name: file.name, size: file.size, type: file.type
    })));
    renderUploadFiles(root, files, copy);
    status.textContent = `${copy.selected}: ${files.length}`;
    status.dataset.invalid = 'false';
  };
  input.onchange = () => acceptFiles(input.files);
  root.querySelector('[data-upload-clear]').onclick = () => {
    files.length = 0;
    input.value = '';
    renderUploadFiles(root, files, copy);
    status.textContent = copy.cleared;
    status.dataset.invalid = 'false';
  };
  if (root.dataset.uploadDemo !== 'DropZone') return;
  const suppressDisabledDrop = event => {
    if (!input.disabled) return false;
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'none';
    zone.dataset.dragActive = 'false';
    return true;
  };
  ['dragenter', 'dragover'].forEach(type => zone.addEventListener(type, event => {
    if (!event.dataTransfer?.types.includes('Files')) return;
    if (suppressDisabledDrop(event)) return;
    event.preventDefault();
    zone.dataset.dragActive = 'true';
  }));
  zone.addEventListener('dragleave', event => {
    if (input.disabled) {
      zone.dataset.dragActive = 'false';
      return;
    }
    if (!zone.contains(event.relatedTarget)) zone.dataset.dragActive = 'false';
  });
  zone.addEventListener('drop', event => {
    if (!event.dataTransfer?.types.includes('Files')) return;
    if (suppressDisabledDrop(event)) return;
    event.preventDefault();
    zone.dataset.dragActive = 'false';
    acceptFiles(event.dataTransfer.files);
  });
}

function wireUploadDemos() {
  document.querySelectorAll('[data-upload-demo]').forEach(wireUploadDemo);
}

function chipMarkup(value, copy, disabled = false) {
  return `<span class="chip"><span>${esc(value)}</span>`
    + `<button type="button" data-chip-remove aria-label="${copy.remove} ${esc(value)}"`
    + `${disabled ? ' disabled' : ''}>×</button></span>`;
}

function chipsDemo(copy, variant) {
  const values = variant === 'variants'
    ? [copy.firstChip, copy.longChip, copy.thirdChip]
    : [copy.firstChip, copy.secondChip];
  const field = variant === 'states' ? 'disabled' : variant === 'variants' ? 'readonly' : '';
  const disabled = variant === 'states';
  return `<div class="chip-demo" data-input-batch-two="Chips" data-variant="${variant}">
  <label class="chip-field"><span>${copy.chipLabel}</span>
    <input data-chip-input placeholder="${copy.chipPlaceholder}" ${field}>
  </label>
  <div class="chip-list" data-chip-list role="list" aria-label="${copy.active}">
    ${values.map(value => chipMarkup(value, copy, disabled)).join('')}
  </div>
  <button type="button" class="btn" data-chip-add ${disabled || variant === 'variants' ? 'disabled' : ''}>
    ${copy.add}
  </button>
  <output class="selection-status" data-input-status role="status">${copy.help}</output>
</div>`;
}

function chipSetDemo(copy, variant) {
  const limit = variant === 'overview' ? 1 : 2;
  const mode = variant === 'overview' ? copy.single : copy.multiple;
  const disabled = variant === 'states';
  const choices = copy.options.map((option, index) => {
    const selected = variant === 'variants' && index < 2 || index === 0;
    return `<button type="button" class="chip chip-choice" data-chip-choice`
      + ` aria-pressed="${selected}"${disabled && index === 2 ? ' disabled' : ''}>`
      + `${esc(option)}</button>`;
  }).join('');
  return `<div class="chip-demo" data-input-batch-two="ChipSet" data-limit="${limit}">
  <fieldset class="chip-field"><legend>${copy.chipSetLabel} · ${mode}</legend>
    <div class="chip-list" data-chipset role="group" aria-label="${copy.active}">${choices}</div>
  </fieldset>
  <output class="selection-status" data-input-status role="status">${copy.selected} ${mode}</output>
</div>`;
}

function numericDemo(copy, variant) {
  const value = variant === 'states' ? 120 : variant === 'variants' ? 25.5 : 20;
  const step = variant === 'variants' ? '0.5' : '5';
  return `<div class="chip-demo" data-input-batch-two="NumericField">
  <label class="chip-field"><span>${copy.numericLabel}</span>
    <input type="number" data-numeric-input value="${value}" min="0" max="100" step="${step}"
      aria-describedby="numeric-${variant}-status">
  </label>
  <div class="actions">
    <button type="button" class="btn" data-numeric-step="-1">−</button>
    <button type="button" class="btn" data-numeric-step="1">+</button>
  </div>
  <output class="selection-status" id="numeric-${variant}-status" data-input-status role="status">
    ${copy.step}
  </output>
</div>`;
}

function inputBatchTwoDemo(name, variant) {
  const copy = t('inputForms');
  if (name === 'Chips') return chipsDemo(copy, variant);
  if (name === 'ChipSet') return chipSetDemo(copy, variant);
  return numericDemo(copy, variant);
}

function inputBatchTwoSection(name, title, variant) {
  const detail = data.componentDetails?.[name];
  const docs = variant === 'overview' && detail ? [
    '<div class="foundation-detail">',
    `<strong>${t('component.anatomy')}</strong><p>${detail.anatomy}</p>`,
    `<strong>${t('component.usage')}</strong><p>${detail.usage}</p>`,
    `<strong>${t('component.sections.api')}</strong><p>${detail.api}</p>`,
    `<strong>${t('component.sections.accessibility')}</strong>`,
    `<p>${detail.accessibility}</p>`,
    '</div>'
  ].join('') : '';
  return `<section class="card doc-section" id="doc-${variant}">
  <div class="card-body"><h2>${title}</h2>
    <div class="demo">${inputBatchTwoDemo(name, variant)}</div>${docs}
  </div>
</section>`;
}

function chipStatus(root, copy, value) {
  root.querySelector('[data-input-status]').textContent = `${copy.selected} ${value}`;
}

function wireChipsDemo(root, copy) {
  const input = root.querySelector('[data-chip-input]');
  const list = root.querySelector('[data-chip-list]');
  const status = root.querySelector('[data-input-status]');
  const remove = event => {
    const chip = event.currentTarget.closest('.chip');
    const chips = [...list.querySelectorAll('.chip')];
    const fallback = chips[chips.indexOf(chip) - 1]?.querySelector('[data-chip-remove]') || input;
    const next = chip.nextElementSibling?.querySelector('[data-chip-remove]') || fallback;
    chip.remove();
    status.textContent = copy.removed;
    next.focus();
  };
  root.querySelectorAll('[data-chip-remove]').forEach(button => button.onclick = remove);
  const add = () => {
    const value = input.value.trim();
    const values = [...list.querySelectorAll('.chip span')];
    if (!value || values.some(chip => chip.textContent === value)) {
      status.textContent = value ? copy.duplicate : copy.empty;
      return;
    }
    list.insertAdjacentHTML('beforeend', chipMarkup(value, copy));
    list.lastElementChild.querySelector('[data-chip-remove]').onclick = remove;
    input.value = '';
    chipStatus(root, copy, value);
  };
  root.querySelector('[data-chip-add]').onclick = add;
  input.onkeydown = event => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    add();
  };
}

function wireChipSetDemo(root, copy) {
  const status = root.querySelector('[data-input-status]');
  root.querySelectorAll('[data-chip-choice]').forEach(button => {
    button.onclick = () => {
      const selected = root.querySelectorAll('[data-chip-choice][aria-pressed="true"]');
      const limit = Number(root.dataset.limit);
      if (!button.matches('[aria-pressed="true"]') && selected.length >= limit) {
        status.textContent = `${copy.limit} (${limit})`;
        return;
      }
      const single = limit === 1;
      if (single) root.querySelectorAll('[data-chip-choice]').forEach(item => {
        item.setAttribute('aria-pressed', String(item === button));
      });
      else button.setAttribute('aria-pressed', button.getAttribute('aria-pressed') !== 'true');
      const values = [...root.querySelectorAll('[data-chip-choice][aria-pressed="true"]')]
        .map(item => item.textContent);
      status.textContent = `${copy.selected} ${values.join(', ') || copy.none}`;
    };
  });
}

function wireNumericDemo(root, copy) {
  const input = root.querySelector('[data-numeric-input]');
  const status = root.querySelector('[data-input-status]');
  const validate = () => {
    const invalid = input.value === '' || Number(input.value) < Number(input.min)
      || Number(input.value) > Number(input.max);
    status.textContent = invalid ? copy.invalid : `${copy.selected} ${input.value}`;
    status.dataset.invalid = String(invalid);
  };
  const step = delta => {
    const next = Number(input.value) + delta * Number(input.step);
    input.value = String(Math.min(Number(input.max), Math.max(Number(input.min), next)));
    validate();
  };
  root.querySelectorAll('[data-numeric-step]').forEach(button => {
    button.onclick = () => step(Number(button.dataset.numericStep));
  });
  input.oninput = validate;
  validate();
}

function wireInputBatchTwo() {
  const copy = t('inputForms');
  document.querySelectorAll('[data-input-batch-two="Chips"]').forEach(root => {
    wireChipsDemo(root, copy);
  });
  document.querySelectorAll('[data-input-batch-two="ChipSet"]').forEach(root => {
    wireChipSetDemo(root, copy);
  });
  document.querySelectorAll('[data-input-batch-two="NumericField"]').forEach(root => {
    wireNumericDemo(root, copy);
  });
}

const visualFoundationNames = new Set([
  'Divider', 'Highlighter', 'Image', 'Link', 'Paper', 'Skeleton',
  'ScrollToTop', 'SwipeArea', 'FocusTrap', 'Element', 'Typography'
]);

function visualCopy(d) {
  return d.visualFoundation;
}

function highlightText(source, query) {
  const value = query.trim();
  if (!value) return esc(source);
  const pattern = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return source.split(new RegExp(`(${pattern})`, 'gi'))
    .map((part, index) => index % 2 ? `<mark>${esc(part)}</mark>` : esc(part)).join('');
}

function matchCount(source, query) {
  const value = query.trim();
  if (!value) return 0;
  const pattern = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return (source.match(new RegExp(pattern, 'gi')) || []).length;
}

function imagePanel(state, copy) {
  if (state === 'loading') return `<div class="vf-image-fallback" role="status">${copy.loading}</div>`;
  if (state === 'fallback') {
    return `<div class="vf-image-fallback" role="img" aria-label="${esc(copy.fallbackAlt)}">`
      + `${copy.fallback}</div>`;
  }
  const source = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' "
    + "viewBox='0 0 640 240'%3E%3Crect width='640' height='240' fill='%235946b2'/%3E"
    + "%3Ccircle cx='520' cy='80' r='64' fill='%2342a5f5'/%3E"
    + "%3Cpath d='M0 210 180 90l100 70 90-55 270 105H0z' fill='%2366bb6a'/%3E%3C/svg%3E";
  return `<img src="${source}" alt="${esc(copy.alt)}">`;
}

function scrollToTopDemo(variant, d) {
  const control = `<button class="btn primary" data-scroll-top hidden>${d.top}</button>`;
  const content = `<div class="vf-scroll-content"><strong>${d.scrollable}</strong>`
    + `<p>${d.bodyCopy}</p><p>${d.groupedContent}</p></div>`;
  const viewport = `<div class="vf-scroll-viewport" data-scroll-viewport data-scroll-threshold="24" tabindex="0">`
    + `${content}</div>`;
  if (variant === 'variants') {
    return `<div class="vf-scroll-demo">${viewport}`
      + `<output role="status" data-scroll-status>${d.scrollable}</output></div>`;
  }
  const state = d.scrollable;
  return `<div class="vf-scroll-demo">${viewport}`
    + `<div class="demo-row">${control}`
    + `<output role="status" data-scroll-status>${state}</output></div></div>`;
}

function swipeAreaDemo(variant, d) {
  const index = variant === 'states' ? 2 : variant === 'variants' ? 1 : 0;
  const position = `${d.slide} ${index + 1} ${d.of} 3`;
  return `<div class="vf-swipe-demo" data-swipe-demo data-swipe-index="${index}">`
    + `<div class="vf-swipe-surface" data-swipe-surface tabindex="0" role="group"`
    + ` aria-label="${d.swipeArea}"><div class="vf-swipe-card" data-swipe-card>`
    + `${position}</div><div class="demo-row">`
    + `<button class="btn" data-swipe-prev>${d.previous}</button>`
    + `<button class="btn" data-swipe-next>${d.next}</button></div></div>`
    + `<output role="status" data-swipe-status>${position}</output></div>`;
}

function focusTrapDemo(variant, d) {
  const headingId = `trap-title-${variant}`;
  const controls = `<div class="demo-row"><button class="btn" data-trap-first>`
    + `${d.first}</button><button class="btn" data-trap-last>${d.last}</button></div>`;
  if (variant === 'variants') {
    return `<div class="vf-trap-demo"><div class="vf-trap-dialog">`
      + `<strong id="${headingId}">${d.focusBoundary}</strong><p>${d.tabCycle}</p>${controls}`
      + `</div><span class="muted">${t('component').escape}</span></div>`;
  }
  return `<div class="vf-trap-demo" data-trap-demo><button class="btn primary"`
    + ` data-trap-open>${d.open}</button><div class="vf-trap-dialog"`
    + ` data-trap-panel role="dialog" aria-modal="true" aria-labelledby="${headingId}" hidden>`
    + `<strong id="${headingId}">${d.focusBoundary}</strong><p>${d.tabCycle}</p>${controls}`
    + `<button class="btn ghost" data-trap-close>${d.close}</button></div>`
    + `<output role="status" data-trap-status>${d.focusBoundary}</output></div>`;
}

function elementDemo(variant, d) {
  const tag = variant === 'states' ? 'article' : variant === 'variants' ? 'nav' : 'section';
  const label = tag === 'nav' ? ` aria-label="${d.navigation}"` : '';
  const controls = ['section', 'article', 'nav'].map(name =>
    `<button class="btn" data-element-tag="${name}">&lt;${name}&gt;</button>`).join('');
  return `<div class="vf-element-demo" data-element-demo><div class="demo-row">`
    + `${controls}</div><${tag} class="vf-element-host" data-element-host${label}>`
    + `<strong>${d.semanticSurface}</strong><span>${d.groupedContent}</span></${tag}>`
    + `<output role="status" data-element-status>&lt;${tag}&gt;</output></div>`;
}

function typographyDemo(variant, d) {
  if (variant === 'states') {
    return `<div class="vf-type-demo"><p class="vf-type-wrap" data-type-wrap>`
      + `${d.bodyCopy} ${d.groupedContent}</p><button class="btn" data-type-truncate>`
      + `${d.caption}</button></div>`;
  }
  const note = variant === 'variants' ? d.resize : d.displayScale;
  return `<div class="vf-type-demo"><div class="vf-type-scale">`
    + `<strong class="vf-type-display">${d.displayScale}</strong>`
    + `<p class="vf-type-body">${d.bodyCopy}</p>`
    + `<small class="vf-type-caption">${d.caption}</small></div>`
    + `<span class="muted">${note}</span></div>`;
}

function visualFoundationDemo(name, variant, d) {
  const copy = visualCopy(d);
  if (name === 'ScrollToTop') {
    return scrollToTopDemo(variant, d);
  }
  if (name === 'SwipeArea') {
    return swipeAreaDemo(variant, d);
  }
  if (name === 'FocusTrap') {
    return focusTrapDemo(variant, d);
  }
  if (name === 'Element') {
    return elementDemo(variant, d);
  }
  if (name === 'Typography') {
    return typographyDemo(variant, d);
  }
  if (name === 'Divider') {
    if (variant === 'variants') return [
      '<div class="visual-foundation-demo"><div class="vf-link-grid">',
      `<span>${copy.horizontal}</span><hr class="vf-divider"><span>${copy.vertical}</span>`,
      '<span><span class="vf-divider-vertical" role="separator" aria-orientation="vertical"></span></span>',
      `<span>${copy.inset}</span><hr class="vf-divider vf-divider-inset"></div></div>`
    ].join('');
    if (variant === 'states') return [
      `<div class="visual-foundation-demo"><div class="vf-label-separator" role="separator"`,
      `aria-label="${esc(copy.labeled)}"><span>${copy.labeled}</span></div>`,
      `<p class="muted">${copy.semantic}</p></div>`
    ].join('');
    return `<div class="visual-foundation-demo"><span>${copy.before}</span>`
      + `<hr class="vf-divider" aria-label="${esc(copy.horizontal)}"><span>${copy.after}</span></div>`;
  }
  if (name === 'Highlighter') {
    const query = variant === 'overview' ? copy.singleQuery
      : variant === 'variants' ? copy.multipleQuery : copy.noMatchQuery;
    return `<div class="visual-foundation-demo" data-highlighter data-source="${esc(copy.source)}">`
      + `<label>${copy.query}<input data-highlight-query value="${esc(query)}"></label>`
      + '<output role="status" data-highlight-count></output>'
      + '<p class="vf-highlight-copy" data-highlight-result></p></div>';
  }
  if (name === 'Image') {
    if (variant === 'variants') return [
      '<div class="visual-foundation-demo"><div class="vf-image-frame"><div>',
      `<strong>${copy.cover}</strong>${imagePanel('loaded', copy)}`,
      '</div></div><div class="vf-image-frame contain"><div>',
      `<strong>${copy.contain}</strong>${imagePanel('loaded', copy)}`,
      '</div></div></div>'
    ].join('');
    if (variant === 'states') return [
      '<div class="visual-foundation-demo" data-image-demo><div class="demo-row">',
      ...['loading', 'loaded', 'fallback'].map(state =>
        `<button class="btn" data-image-state="${state}">${copy[state]}</button>`),
      `</div><div class="vf-image-frame" data-image-frame>${imagePanel('loading', copy)}`,
      `</div><output role="status" data-image-status>${copy.loading}</output></div>`
    ].join('');
    return `<div class="visual-foundation-demo"><div class="vf-image-frame">`
      + `${imagePanel('loaded', copy)}</div><span class="muted">${copy.responsive}</span></div>`;
  }
  if (name === 'Link') {
    if (variant === 'variants') return `<div class="visual-foundation-demo vf-link-grid">`
      + `<a href="#explore">${copy.internal}</a>`
      + `<a href="https://docs.thiscloud.example/guide" target="_blank" rel="noreferrer">`
      + `${copy.external} <span aria-hidden="true">↗</span></a></div>`;
    if (variant === 'states') return `<div class="visual-foundation-demo vf-link-grid">`
      + `<a href="#component/link" aria-current="page">${copy.current}</a>`
      + `<a href="#explore" data-visited>${copy.visited}</a>`
      + `<span aria-disabled="true">${copy.disabled}</span></div>`;
    return `<div class="visual-foundation-demo vf-link-grid"><a href="#explore">`
      + `${copy.internal}</a><span class="muted">${copy.focus}</span></div>`;
  }
  if (name === 'Paper') {
    if (variant === 'variants') return [
      '<div class="visual-foundation-demo vf-paper-grid">',
      `<article class="vf-paper outlined"><strong>${copy.outlined}</strong><p>${copy.boundary}</p></article>`,
      `<article class="vf-paper elevated"><strong>${copy.elevated}</strong><p>${copy.elevation}</p></article>`,
      `<article class="vf-paper tonal"><strong>${copy.tonal}</strong><p>${copy.padding}</p></article></div>`
    ].join('');
    if (variant === 'states') return `<div class="visual-foundation-demo"><section class="vf-paper tonal"`
      + ` aria-labelledby="paper-state">`
      + `<h3 id="paper-state">${copy.tonal}</h3><p>${copy.grouping}</p></section></div>`;
    return `<div class="visual-foundation-demo"><article class="vf-paper outlined">`
      + `<strong>${copy.outlined}</strong><p>${copy.boundary}</p></article></div>`;
  }
  if (variant === 'variants') return [
    '<div class="visual-foundation-demo vf-skeleton-grid" aria-busy="true"><div aria-hidden="true">',
    '<span class="vf-skeleton"></span><span class="vf-skeleton short"></span></div>',
    '<div class="vf-skeleton avatar" aria-hidden="true"></div><div class="vf-skeleton-card" aria-hidden="true">',
    '<span class="vf-skeleton"></span><span class="vf-skeleton short"></span></div></div>'
  ].join('');
  if (variant === 'states') return [
    '<div class="visual-foundation-demo" data-skeleton-demo aria-busy="true">',
    `<button class="btn" data-skeleton-toggle>${copy.skeletonLoaded}</button>`,
    '<div data-skeleton-content><div class="vf-skeleton-grid" aria-hidden="true">',
    '<span class="vf-skeleton"></span><span class="vf-skeleton short"></span></div>',
    '</div>',
    `<output role="status" data-skeleton-status>${copy.skeletonLoading}</output></div>`
  ].join('');
  return `<div class="visual-foundation-demo vf-skeleton-grid" aria-busy="true">`
    + '<span class="vf-skeleton" aria-hidden="true"></span>'
    + '<span class="vf-skeleton short" aria-hidden="true"></span>'
    + `<span class="muted">${copy.reducedMotion}</span></div>`;
}

function wireVisualFoundationDemos() {
  document.querySelectorAll('[data-scroll-viewport]').forEach(viewport => {
    const root = viewport.closest('.vf-scroll-demo');
    const copy = t('demo');
    const threshold = Number(viewport.dataset.scrollThreshold || 24);
    const button = root.querySelector('[data-scroll-top]');
    const update = () => {
      const ready = viewport.scrollTop > threshold;
      if (button) button.hidden = !ready;
      root.querySelectorAll('[data-scroll-status]')
        .forEach(status => { status.textContent = ready ? copy.top : copy.scrollable; });
    };
    viewport.onscroll = update;
    update();
    root.querySelector('[data-scroll-top]')?.addEventListener('click', () => {
      const behavior = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
      viewport.scrollTo({ top: 0, behavior });
      viewport.focus({ preventScroll: true });
      update();
    });
  });
  document.querySelectorAll('[data-swipe-demo]').forEach(root => {
    const surface = root.querySelector('[data-swipe-surface]');
    const status = root.querySelector('[data-swipe-status]');
    const card = root.querySelector('[data-swipe-card]');
    const copy = t('demo');
    let startX = 0;
    let startY = 0;
    const move = delta => {
      let index = Number(root.dataset.swipeIndex) + delta;
      index = (index + 3) % 3;
      root.dataset.swipeIndex = index;
      const text = `${copy.slide} ${index + 1} ${copy.of} 3`;
      card.textContent = text;
      status.textContent = text;
    };
    root.querySelector('[data-swipe-prev]').onclick = () => move(-1);
    root.querySelector('[data-swipe-next]').onclick = () => move(1);
    surface.onpointerdown = event => { startX = event.clientX; startY = event.clientY; };
    surface.onpointerup = event => {
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      const distance = Math.max(Math.abs(dx), Math.abs(dy));
      if (distance <= 30) return;
      if (Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1);
      else move(dy < 0 ? 1 : -1);
    };
    surface.onkeydown = event => {
      const direction = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: 1, ArrowDown: -1 }[event.key];
      if (direction) { event.preventDefault(); move(direction); }
    };
  });
  document.querySelectorAll('[data-trap-demo]').forEach(root => {
    const open = root.querySelector('[data-trap-open]');
    const panel = root.querySelector('[data-trap-panel]');
    const first = root.querySelector('[data-trap-first]');
    const last = root.querySelector('[data-trap-last]');
    const close = root.querySelector('[data-trap-close]');
    const status = root.querySelector('[data-trap-status]');
    let invoker;
    const closeTrap = () => {
      panel.hidden = true;
      status.textContent = t('demo').focusBoundary;
      invoker?.focus();
    };
    open.onclick = () => {
      invoker = document.activeElement;
      panel.hidden = false;
      status.textContent = t('demo').tabCycle;
      first.focus();
    };
    close.onclick = closeTrap;
    panel.onkeydown = event => {
      if (event.key === 'Escape') closeTrap();
      if (event.key === 'Tab' && event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (event.key === 'Tab' && !event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
  });
  document.querySelectorAll('[data-element-demo]').forEach(root => {
    root.querySelectorAll('[data-element-tag]').forEach(button => button.onclick = () => {
      const old = root.querySelector('[data-element-host]');
      const tag = button.dataset.elementTag;
      const next = document.createElement(tag);
      next.className = old.className;
      next.dataset.elementHost = '';
      if (tag === 'nav') next.setAttribute('aria-label', t('demo').navigation);
      next.innerHTML = old.innerHTML;
      old.replaceWith(next);
      root.querySelector('[data-element-status]').textContent = `<${tag}>`;
    });
  });
  document.querySelectorAll('[data-type-truncate]').forEach(button => button.onclick = () => {
    const wrap = button.closest('.vf-type-demo')?.querySelector('[data-type-wrap]');
    wrap?.classList.toggle('is-truncated');
  });
  document.querySelectorAll('[data-highlighter]').forEach(root => {
    const input = root.querySelector('[data-highlight-query]');
    const update = () => {
      root.querySelector('[data-highlight-result]').innerHTML =
        highlightText(root.dataset.source, input.value);
      root.querySelector('[data-highlight-count]').textContent =
        `${matchCount(root.dataset.source, input.value)} ${visualCopy(t('demo')).matches}`;
    };
    input.oninput = update;
    update();
  });
  document.querySelectorAll('[data-image-demo]').forEach(root => root.querySelectorAll('[data-image-state]')
    .forEach(button => button.onclick = () => {
    const copy = visualCopy(t('demo'));
    root.querySelector('[data-image-frame]').innerHTML = imagePanel(button.dataset.imageState, copy);
    root.querySelector('[data-image-status]').textContent = copy[button.dataset.imageState];
  }));
  document.querySelectorAll('[data-skeleton-demo]').forEach(root =>
    root.querySelector('[data-skeleton-toggle]').onclick = () => {
    const copy = visualCopy(t('demo'));
    const loading = root.getAttribute('aria-busy') === 'true';
    root.setAttribute('aria-busy', String(!loading));
    root.querySelector('[data-skeleton-content]').innerHTML = loading ? `<p>${copy.content}</p>`
      : '<div class="vf-skeleton-grid" aria-hidden="true"><span class="vf-skeleton"></span>'
        + '<span class="vf-skeleton short"></span></div>';
    root.querySelector('[data-skeleton-status]').textContent = loading ? copy.content : copy.skeletonLoading;
  });
}

function visualFoundationSection(name, title, variant) {
  const detail = data.componentDetails?.[name];
  const d = t('demo');
  const docs = variant === 'overview' && detail ? `<div class="foundation-detail">`
    + `<strong>${t('component.anatomy')}</strong><p>${detail.anatomy}</p>`
    + `<strong>${t('component.usage')}</strong><p>${detail.usage}</p>`
    + `<strong>${t('component.sections.api')}</strong><p>${detail.api}</p>`
    + `<strong>${t('component.sections.accessibility')}</strong><p>${detail.accessibility}</p></div>` : '';
  return `<section class="card doc-section" id="doc-${variant}"><div class="card-body">`
    + `<h2>${title}</h2><div class="demo">${visualFoundationDemo(name, variant, d)}</div>${docs}</div></section>`;
}

function foundationDetail(name, key, title) {
  const detail = data.componentDetails?.[name];
  return detail ? `<div class="foundation-detail"><strong>${title}</strong><p>${detail[key]}</p></div>` : '';
}
function section(name, title, variant) {
   if (feedbackNames.has(name)) return feedbackSection(name, title, variant);
   if (navigationNames.has(name)) return navigationSection(name, title, variant);
   if (surfaceNames.has(name)) return surfaceSection(name, title, variant);
  if ([
    'Button', 'ButtonFab', 'ButtonGroup', 'IconButton', 'ToggleIconButton', 'Toolbar'
  ].includes(name)) return actionSection(name, title, variant);
   if (selectionInputNames.has(name)) return selectionInputSection(name, title, variant);
   if (fieldNames.has(name)) return fieldSection(name, title, variant);
  if (radioNames.has(name)) return radioSection(name, title, variant);
  if (nativeInputNames.has(name)) return nativeInputSection(name, title, variant);
  if (uploadNames.has(name)) return uploadSection(name, title, variant);
  if (inputBatchTwoNames.has(name)) return inputBatchTwoSection(name, title, variant);
  if (visualFoundationNames.has(name)) return visualFoundationSection(name, title, variant);
  const item = all.find(record => record.name === name || record.slug === name);
  const profile = data.profileOverrides[name] || data.profiles[item?.category || 'Foundations/Layout'];
  const labels = variant === 'overview' ? [] : (variant === 'variants' ? profile.variants : profile.states);
  const anatomy = variant === 'overview' ? foundationDetail(name, 'anatomy', t('component.anatomy')) : '';
  const usage = variant === 'overview' ? foundationDetail(name, 'usage', t('component.usage')) : '';
  const variants = labels.length
    ? `<div class="variant-strip" aria-label="${esc(title)}">${labels.map(x => `<span class="variant-chip"><i></i>${esc(x)}</span>`).join('')}</div>`
    : '';
  return [
    `<section class="card doc-section" id="doc-${variant}"><div class="card-body"><h2>${title}</h2>`,
    `<p>${esc(t('components.' + name))}</p><div class="demo">${demo(name, variant)}${variants}</div>`,
    `${anatomy}${usage}<button class="btn ghost code-toggle" data-n="${name}" data-v="${variant}">`,
    `${t('component.showCode')}</button></div></section>`
  ].join('');
}
 function surfaceSection(name, title, variant) {
   const detail = data.componentDetails?.[name];
   const docs = variant === 'overview' && detail ? `<div class="foundation-detail">`
     + `<strong>${t('component.anatomy')}</strong><p>${detail.anatomy}</p>`
     + `<strong>${t('component.usage')}</strong><p>${detail.usage}</p>`
     + `<strong>${t('component.sections.api')}</strong><p>${detail.api}</p>`
     + `<strong>${t('component.sections.accessibility')}</strong><p>${detail.accessibility}</p></div>` : '';
   return `<section class="card doc-section" id="doc-${variant}"><div class="card-body">`
     + `<h2>${title}</h2><p>${esc(t('components.' + name))}</p>`
     + `<div class="demo">${surfaceDemo(name, variant)}</div>${docs}</div></section>`;
 }
function foundationSection(name, title, key, fallback) {
  const detail = data.componentDetails?.[name];
  const text = detail?.[key] || fallback;
  return [
    `<section class="card doc-section" id="doc-${key}"><div class="card-body"><h2>${title}</h2>`,
    `<p><strong>${name}</strong>: ${text}</p></div></section>`
  ].join('');
}
function explore(){const e=t('explore');return `<section class="hero"><div class="eyebrow">${e.eyebrow}</div><h1>${e.title}</h1><p>${e.intro}</p><div class="actions"><a class="btn primary" href="#category/foundations-layout">${e.foundations}</a><a class="btn" href="#guidance/getting-started">${e.gettingStarted}</a><button class="btn" data-dialog>${e.tryDialog}</button></div></section><div class="section-title"><h2>${e.browse}</h2></div><div class="grid">${Object.entries(categories).map(([c,ns])=>`<a class="card" href="#category/${catSlug(c)}"><div class="schematic">${demo(ns[0],'overview')}</div><div class="card-body"><h3>${t('nav.categories.'+c)}</h3><p>${ns.length} ${e.documented}.</p><span class="pill info">${e.openCategory}</span></div></a>`).join('')}</div><div class="section-title"><h2>${e.featured}</h2></div><div class="component-grid">${['Button','TextField','Card','Alert','Tabs','BarChart'].map(n=>`<a class="card" href="#component/${itemFor(n.replace(/([a-z])([A-Z])/g,'$1-$2').toLowerCase()).slug}"><div class="schematic">${demo(n,'overview')}</div><div class="card-body"><h3>${n}</h3>${badge(production.has(n)?'production':'roadmap')}</div></a>`).join('')}</div>`;}
function categoryPage(v){const c=Object.keys(categories).find(x=>catSlug(x)===v);if(!c)return notFound();return `<div class="page-head"><div class="eyebrow">${t('category.eyebrow')}</div><h1>${t('nav.categories.'+c)}</h1><p>${categories[c].length} ${t('category.intro')}</p></div><div class="component-grid">${categories[c].map(n=>`<article class="card"><div class="schematic">${demo(n,'overview')}</div><div class="card-body"><h3>${n}</h3><p>${esc(t('components.'+n))}</p>${badge(production.has(n)?'production':'roadmap')}<div class="actions"><a class="btn primary" href="#component/${itemFor(n.replace(/([a-z])([A-Z])/g,'$1-$2').toLowerCase()).slug}">${t('category.openReference')}</a></div></div></article>`).join('')}</div>`;}
 function componentPage(v){const x=itemFor(v);if(!x)return notFound();const c=t('component'),titles=[c.sections.overview,c.sections.variants,c.sections.states,c.sections.accessibility,c.sections.api,c.sections.related],chartCopy=chartNames.has(x.name)?t('charts.'+x.name):null,chartA11y=chartCopy?.accessibility;return `<div class="component-layout"><div class="page-head"><div class="eyebrow">${t('nav.categories.'+x.category)} · ${badge(x.status)}</div><h1>${x.name}</h1><p>${esc(t('components.'+x.name))}</p><div class="row"><span class="pill info">Tc${x.name}</span><span class="pill">tc.ui.${x.slug}</span>${badge(x.status)}</div>${titles.map((title,i)=>i<3?section(x.name,title,['overview','variants','states'][i]):i===3?`<section class="card doc-section" id="doc-accessibility"><div class="card-body"><h2>${chartCopy?.accessibilityTitle || title}</h2><p><strong>${x.name}</strong>: ${chartA11y || c.accessibilityText}</p>${chartA11y ? `<span class="pill info">${chartCopy.roleLabel}</span>` : `<div class="demo-row"><button class="btn primary">${c.tabFocus}</button><span class="pill info">${c.enterSpace}</span><span class="pill">${c.escape}</span></div>`}</div></section>`:i===4?`<section class="card doc-section" id="doc-api"><div class="card-body"><h2>${title}</h2><p>${c.stableIdentity}: <strong>Tc${x.name}</strong> · <code>tc.ui.${x.slug}</code>.</p></div></section>`:`<section class="card doc-section" id="doc-related"><div class="card-body"><h2>${title}</h2><p>${c.relatedText}</p><div class="actions">${all.filter(y=>y.category===x.category&&y.name!==x.name).slice(0,3).map(y=>`<a class="btn" href="#component/${y.slug}">${y.name}</a>`).join('')}</div></div></section>`).join('')}</div><aside class="toc"><strong>${c.sections.overview}</strong>${titles.map((title,i)=>`<button data-scroll="doc-${['overview','variants','states','accessibility','api','related'][i]}">${chartCopy?.accessibilityTitle && i===3 ? chartCopy.accessibilityTitle : title}</button>`).join('')}</aside></div>`;}
function componentPage(v) {
  const x = itemFor(v);
  if (!x) return notFound();
  const c = t('component');
  const chartCopy = chartNames.has(x.name) ? t('charts.' + x.name) : null;
  const titles = [c.sections.overview, c.sections.variants, c.sections.states, c.sections.accessibility, c.sections.api, c.sections.related];
  const sections = titles.map((title, i) => {
    if (i < 3) return section(x.name, title, ['overview', 'variants', 'states'][i]);
    if (i === 3 && chartCopy) {
      return foundationSection(x.name, chartCopy.accessibilityTitle, 'accessibility', chartCopy.accessibility)
        .replace(`<p><strong>${x.name}</strong>:`, `<p><strong>${x.name}</strong>:`)
        .replace('</p></div></section>', `<span class="pill info">${chartCopy.roleLabel}</span></p></div></section>`);
    }
    if (i === 3) return `<section class="card doc-section" id="doc-accessibility"><div class="card-body"><h2>${title}</h2><p><strong>${x.name}</strong>: ${c.accessibilityText}</p><div class="demo-row"><button class="btn primary">${c.tabFocus}</button><span class="pill info">${c.enterSpace}</span><span class="pill">${c.escape}</span></div></div></section>`;
    if (i === 4) return `<section class="card doc-section" id="doc-api"><div class="card-body"><h2>${title}</h2><p>${x.api ? apiBoundary(x.api) : demoBoundary()}</p></div></section>`;
    return `<section class="card doc-section" id="doc-related"><div class="card-body"><h2>${title}</h2><p>${c.relatedText}</p><div class="actions">${all.filter(y => y.category === x.category && y.name !== x.name).slice(0, 3).map(y => `<a class="btn" href="#component/${y.slug}">${y.name}</a>`).join('')}</div></div></section>`;
  }).join('');
  return `<div class="component-layout"><div class="page-head"><div class="eyebrow">${t('nav.categories.' + x.category)} · ${badge(x.status)}</div><h1>${x.name}</h1><p>${esc(t('components.' + x.name))}</p><div class="row">${x.api ? apiBoundary(x.api) : demoBoundary()}${badge(x.status)}</div>${sections}</div><aside class="toc"><strong>${c.sections.overview}</strong>${titles.map((title, i) => `<button data-scroll="doc-${['overview', 'variants', 'states', 'accessibility', 'api', 'related'][i]}">${chartCopy?.accessibilityTitle && i === 3 ? chartCopy.accessibilityTitle : title}</button>`).join('')}</aside></div>`;
}
function guidance(v){if(v==='build-status')return buildStatus();if(v==='download')return downloadPage();const g=t('guidance'),title={"getting-started":t('nav.gettingStarted'),customization:t('nav.customization'),accessibility:t('nav.accessibility')}[v]||g.eyebrow;return `<div class="page-head"><div class="eyebrow">${g.eyebrow}</div><h1>${title}</h1><p>${g.intro}</p></div><div class="grid"><article class="card"><div class="card-body"><h2>${g.quickPath}</h2><ol><li>${g.step1}</li><li>${g.step2}</li><li>${g.step3}</li></ol></div></article><article class="card"><div class="card-body"><h2>${g.coreRule}</h2><p>${g.ruleText}</p><span class="pill production">${g.available}</span></div></article></div>`;}
function downloadPage(){const d=t('download'),file='thiscloud-ui-web-0.1.0-rc.1.tgz';return `<div class="page-head download-guide"><div class="eyebrow">${d.eyebrow}</div><h1>${d.title}</h1><p>${d.intro}</p><div class="actions"><a class="btn primary" data-package-download href="/downloads/${file}" download>${icon('download')}${d.package}</a><a class="btn" data-checksum-download href="/downloads/${file}.sha256" download>${icon('verified')}${d.checksum}</a></div></div><div class="grid download-guide"><article class="card"><div class="card-body"><h2>${d.installTitle}</h2><ol><li><strong>${d.step1Title}</strong><p>${d.step1}</p></li><li><strong>${d.step2Title}</strong><p>${d.step2}</p><h3>${d.linux}</h3><pre class="code"><code>sha256sum -c ${file}.sha256</code></pre><h3>${d.powershell}</h3><pre class="code"><code>Get-FileHash .\\${file} -Algorithm SHA256</code></pre></li><li><strong>${d.step3Title}</strong><pre class="code"><code>pnpm add ./${file}</code></pre></li><li><strong>${d.step4Title}</strong><pre class="code"><code>import '@thiscloud/ui-web';\nimport '@thiscloud/ui-web/tokens.css';</code></pre></li></ol></div></article><article class="card"><div class="card-body"><h2>${d.useTitle}</h2><p>${d.useIntro}</p><pre class="code"><code>&lt;tc-switch label="Notifications"&gt;&lt;/tc-switch&gt;\n&lt;tc-text-field label="Organization"&gt;&lt;/tc-text-field&gt;</code></pre><p>${d.boundary}</p><span class="pill production">0.1.0-rc.1</span></div></article></div><div class="actions"><a class="btn" href="/">${icon('arrow_back')}${d.back}</a></div>`;}
function buildStatus(){const b=t('buildStatus'),row=(s,d,k)=>`<article class="card"><div class="card-body"><div class="eyebrow">${b.stage}</div><h2>${s}</h2><p>${d}</p>${badge(k)}</div></article>`;return `<div class="page-head"><div class="eyebrow">${b.eyebrow}</div><h1>${b.title}</h1><p>${b.intro}</p></div><div class="grid">${row(b.stage1,b.stage1Detail,'production')}${row(b.stage2,b.stage2Detail,'completed')}${row(b.stage3,b.stage3Detail,'roadmap')}</div><div class="section-title"><h2>${b.coverage}</h2></div><div class="grid">${['components','categories','icons','locales'].map(k=>`<article class="card"><div class="card-body"><h2>${b[k]}</h2><p>${b[k+'Detail']}</p></div></article>`).join('')}</div><div class="grid"><article class="card"><div class="card-body"><h2>${b.changeLog}</h2><ul><li>${b.accordion}</li><li>${b.docs}</li><li>${b.iconCorrection}</li><li>${b.bilingual}</li></ul></div></article><article class="card"><div class="card-body"><h2>${b.verification}</h2><ul><li>${b.checkRoutes}</li><li>${b.checkIcons}</li><li>${b.checkRuntime}</li></ul><p><strong>${b.liveUrl}</strong><br><code>${b.liveUrlValue}</code></p><h3>${b.nextBoundary}</h3><p>${b.nextBoundaryText}</p></div></article></div>`;}
function iconsPage(){const i=t('icons');return `<div class="page-head"><div class="eyebrow">${i.eyebrow}</div><h1>${i.title}</h1><p>${i.intro}</p></div><div class="card"><div class="card-body"><div id="iconLoading" class="banner">${i.loading}</div><div id="iconError" class="banner" hidden role="alert"></div><div id="iconExplorer" hidden><label class="search"><span class="ms">search</span><input id="iconSearch" aria-label="${i.searchLabel}" placeholder="${i.searchPlaceholder}"></label><p id="iconCount" class="pill production"></p><div class="icon-detail" id="iconDetail"><div class="icon-big"><span class="ms fill">category</span></div><div><h2>${i.select}</h2><p>${i.selectIntro}</p></div></div><div class="icon-grid" id="iconGrid"></div><button class="btn" id="loadMore">${i.loadMore}</button><p id="fontReport"></p></div></div></div>`;}
function glyph(r,s=''){return `<span class="ms" style="${s}" aria-hidden="true">&#x${r.codepoint};</span>`}function initIcons(initial=''){fetch('./assets/icons/material-symbols-rounded-names.json').then(r=>r.ok?r.json():Promise.reject(Error('HTTP '+r.status))).then(d=>{icons=d;document.getElementById('iconLoading').hidden=true;document.getElementById('iconExplorer').hidden=false;document.getElementById('fontReport').textContent=`${t('icons.source')}: ${d.sourceFont} · ${d.iconCount.toLocaleString()} ${t('icons.officialNames')} · ${d.codepointCount.toLocaleString()} ${t('icons.uniqueCodepoints')} · ${t('icons.axes')}: ${d.axes.map(x=>x.tag).join(', ')}`;document.getElementById('iconSearch').oninput=()=>{shown=48;drawIcons()};document.getElementById('loadMore').onclick=()=>{shown+=48;drawIcons()};if(initial)document.getElementById('iconSearch').value=initial;drawIcons();if(initial&&d.records.some(x=>x.name===initial))selectIcon(initial)}).catch(e=>{document.getElementById('iconLoading').hidden=true;const b=document.getElementById('iconError');b.hidden=false;b.textContent=`${t('icons.error')}: ${e.message}`})}function drawIcons(){const q=document.getElementById('iconSearch').value.trim().toLowerCase(),featured=['search','home','menu','settings','person','favorite','check','close','add','edit','delete','cloud','security','database','rocket_launch','palette','code','notifications','visibility','download'],rank=new Map(featured.map((x,i)=>[x,i])),m=icons.records.filter(x=>x.name.includes(q));if(!q)m.sort((a,b)=>(rank.get(a.name)??9999)-(rank.get(b.name)??9999)||a.name.localeCompare(b.name));document.getElementById('iconCount').textContent=`${m.length.toLocaleString()} ${t('icons.matches')}`;document.getElementById('iconGrid').innerHTML=m.slice(0,shown).map(x=>`<button class="icon-tile" data-icon="${x.name}">${glyph(x)}<span>${x.name}</span></button>`).join('')||`<div class="empty">${t('icons.noMatches')}</div>`;document.querySelectorAll('[data-icon]').forEach(x=>x.onclick=()=>selectIcon(x.dataset.icon));document.getElementById('loadMore').hidden=shown>=m.length}
function selectIcon(n){selected=icons.records.find(x=>x.name===n);const i=t('icons'),ws=[200,400,600],ss=[20,24,40,48],gs=[-50,0,200],vs=[0,1].flatMap(f=>ws.flatMap(w=>ss.map(s=>({f,w,s}))));document.getElementById('iconDetail').innerHTML=`<div class="icon-big" id="largeIcon">${glyph(selected,"font-size:68px")}</div><div><div class="row"><h2>${selected.name}</h2><button class="btn" id="copyToken">${i.copy}</button></div><p>Codepoint U+${selected.codepoint.toUpperCase()} · ${i.accessible}</p><div class="demo-row"><button class="btn" id="fillToggle">FILL 0</button><label>wght <output id="weightValue">400</output><input id="weightAxis" type="range" min="100" max="700" value="400"></label><label>GRAD <output id="gradeValue">0</output><input id="gradeAxis" type="range" min="-50" max="200" value="0"></label><label>opsz <output id="opticalValue">24</output><input id="opticalAxis" type="range" min="20" max="48" value="24"></label></div><h3>${i.outlinedFilled}</h3><div class="matrix"><div class="cell">${glyph(selected)}<br>FILL 0</div><div class="cell">${glyph(selected,"font-variation-settings:'FILL' 1") }<br>FILL 1</div></div><h3>${i.weight}</h3><div class="matrix">${ws.map(w=>`<div class="cell">${glyph(selected,`font-variation-settings:'wght' ${w}`)}<br>${w}</div>`).join('')}</div><h3>${i.optical}</h3><div class="matrix">${ss.map(s=>`<div class="cell">${glyph(selected,`font-size:${s}px`)}<br>${s}</div>`).join('')}</div><h3>${i.grade}</h3><div class="matrix">${gs.map(g=>`<div class="cell">${glyph(selected,`font-variation-settings:'GRAD' ${g}`)}<br>${g}</div>`).join('')}</div><h3>${i.practical}</h3><div class="matrix">${vs.map(v=>`<div class="cell">${glyph(selected,`font-variation-settings:'FILL' ${v.f},'wght' ${v.w},'opsz' ${v.s}`)}<br>FILL ${v.f} · ${v.w} · ${v.s}</div>`).join('')}</div></div>`;const update=()=>{const f=document.getElementById('fillToggle').textContent.includes('1')?1:0,w=document.getElementById('weightAxis').value,g=document.getElementById('gradeAxis').value,o=document.getElementById('opticalAxis').value;document.getElementById('weightValue').textContent=w;document.getElementById('gradeValue').textContent=g;document.getElementById('opticalValue').textContent=o;document.getElementById('largeIcon').firstElementChild.style.fontVariationSettings=`'FILL' ${f},'wght' ${w},'GRAD' ${g},'opsz' ${o}`};['weightAxis','gradeAxis','opticalAxis'].forEach(x=>document.getElementById(x).oninput=update);document.getElementById('fillToggle').onclick=e=>{e.currentTarget.textContent=e.currentTarget.textContent.includes('0')?'FILL 1':'FILL 0';update()};document.getElementById('copyToken').onclick=()=>{navigator.clipboard?.writeText(selected.name);document.getElementById('copyToken').textContent=i.copied}}
function wireSearch() {
  const input = document.getElementById('globalSearch');
  const box = document.getElementById('searchResults');
  input.oninput = () => {
    const query = input.value.trim().toLowerCase();
    if (!query) { box.hidden = true; return; }
    const guidance = [['getting-started', t('nav.gettingStarted')], ['customization', t('nav.customization')], ['accessibility', t('nav.accessibility')], ['build-status', t('nav.buildStatus')]];
    const results = [
      ...all.map(x => ({label:x.name, type:'component', href:'#component/'+x.slug})),
      ...Object.keys(categories).map(x => ({label:t('nav.categories.'+x), type:'category', href:'#category/'+catSlug(x)})),
      ...guidance.map(([slug,label]) => ({label, type:'guidance', href:'#guidance/'+slug})),
      ...(icons?.records || []).map(x => ({label:x.name, type:'icon', href:'#icons/'+encodeURIComponent(x.name)}))
    ].filter(x => x.label.toLowerCase().includes(query)).slice(0, 20);
    box.innerHTML = results.map(x => `<a class="search-result" href="${x.href}"><strong>${esc(x.label)}</strong><small class="muted"> · ${t('search.'+x.type)}</small></a>`).join('') || `<span class="search-result muted">${t('search.noMatches')} ${t('search.selection')}</span>`;
    box.hidden = false;
  };
  input.onkeydown = event => { if (event.key === 'Enter') box.querySelector('a')?.click(); };
  box.onclick = event => { if (event.target.closest('a')) { input.value = ''; box.hidden = true; } };
}
  function responsiveStandard(){const text=t('buildStatus.responsiveStandard');const section=document.createElement('section');section.className='card responsive-standard';section.innerHTML=`<div class="card-body"><h2>${t('buildStatus.responsiveStandardTitle')}</h2><p>${text}</p></div>`;document.getElementById('view')?.append(section)}
  function applyLayoutTokens(){document.querySelector('.sidebar footer')?.style.removeProperty('padding');}
  applyLayoutTokens();
 function showLocaleError(requested){const copy=data?.localeError || (requested==='es'?{title:'No se pudo cargar el idioma',text:'El contenido local no está disponible. Verifique el servidor del prototipo.'}:{title:'Unable to load locale',text:'Local translation content is unavailable. Check the prototype server.'});document.getElementById('view').innerHTML=`<div class="empty"><h1>${copy.title}</h1><p>${copy.text}</p></div>`;}function notFound(){return `<div class="empty"><h1>${t('notFound.title')}</h1><p>${t('notFound.text')}</p></div>`}function render(){const pathRoute=/^\/downloads\/?$/.test(location.pathname)?'guidance/download':'',h=location.hash.slice(1)||pathRoute||'explore',ir=h==='icons'||h.startsWith('icons/');document.documentElement.dataset.route=h==='guidance/download'?'download':'catalog';document.getElementById('view').innerHTML=h==='explore'?explore():ir?iconsPage():h.startsWith('category/')?categoryPage(h.slice(9)):h.startsWith('component/')?componentPage(h.slice(10)):h.startsWith('guidance/')?guidance(h.slice(9)):notFound();document.querySelectorAll('.nav a').forEach(a=>{const on=a.getAttribute('href')==='#'+h||(ir&&a.getAttribute('href')==='#icons');a.classList.toggle('active',on);on?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current')});document.querySelectorAll('[data-scroll]').forEach(x=>x.onclick=()=>document.getElementById(x.dataset.scroll)?.scrollIntoView({behavior:'smooth'}));document.querySelectorAll('.code-toggle').forEach(x=>x.onclick=()=>{const n=x.nextElementSibling;n?n.remove():(x.insertAdjacentHTML('afterend',`<pre class="code">Tc${x.dataset.n}(variant: '${x.dataset.v}', scope: 'center-aurora')</pre>`));x.textContent=n?t('component.showCode'):t('component.hideCode')});document.querySelectorAll('[data-dialog]').forEach(x=>x.onclick=e=>{const invoker=e.currentTarget;if(!invoker.id)invoker.id='dialog-invoker';const overlay=document.getElementById('overlay');overlay.dataset.invoker=invoker.id;overlay.classList.add('open');document.getElementById('dialogConfirm').focus()});wireFoundationDemos();if(h==='guidance/build-status')responsiveStandard();if(ir)initIcons(decodeURIComponent(h.slice(6)));document.getElementById('main').focus({preventScroll:true})}
 document.addEventListener('click',e=>{if(e.target.matches('[data-close]')){const overlay=document.getElementById('overlay');overlay.classList.remove('open');if(overlay.dataset.invoker)document.getElementById(overlay.dataset.invoker)?.focus()}});document.addEventListener('keydown',e=>{if(e.key==='Escape')document.getElementById('overlay').classList.remove('open')});document.getElementById('theme').onclick=()=>document.documentElement.dataset.theme=document.documentElement.dataset.theme==='light'?'dark':'light';document.getElementById('density').onclick=()=>{document.documentElement.dataset.density=document.documentElement.dataset.density==='compact'?'comfortable':'compact';chrome();document.getElementById('toast').classList.add('show');setTimeout(()=>document.getElementById('toast').classList.remove('show'),1400)};document.getElementById('language').onclick=()=>{const next=locale==='es'?'en':'es';fetch(`./assets/i18n/${next}.json`).then(r=>r.ok?r.json():Promise.reject()).then(d=>{locale=next;data=d;localStorage.setItem('thiscloud-ui-locale',locale);chrome()}).catch(()=>showLocaleError(next))};document.getElementById('menu').onclick=()=>{document.getElementById('sidebar').classList.add('open');document.getElementById('backdrop').classList.add('open')};document.getElementById('backdrop').onclick=()=>{document.getElementById('sidebar').classList.remove('open');document.getElementById('backdrop').classList.remove('open')};
fetch(`./assets/i18n/${locale}.json`).then(r=>r.ok?r.json():Promise.reject()).then(d=>{data=d;chrome()}).catch(()=>showLocaleError(locale));fetch('./assets/icons/material-symbols-rounded-names.json').then(r=>r.ok?r.json():Promise.reject()).then(d=>{icons=d}).catch(()=>{});window.onhashchange=render;window.ThiscloudCatalog={records:all,assertions:{componentCount:all.length,categoryCounts:Object.fromEntries(Object.entries(categories).map(([k,v])=>[k,v.length])),noDetails:true,defaultLocale:'es',locales:['en','es']}};

const componentIcons = {
  BreakpointProvider: 'tune',
  Container: 'crop_free',
  Divider: 'horizontal_rule',
  Element: 'code',
  FocusTrap: 'lock',
  Grid: 'grid_view',
  Hidden: 'visibility_off',
  Highlighter: 'highlight',
  Image: 'image',
  Link: 'link',
  Paper: 'article',
  ScrollToTop: 'vertical_align_top',
  Skeleton: 'hourglass_empty',
  SwipeArea: 'swipe',
  Typography: 'text_fields',
  Button: 'touch_app',
  ButtonFab: 'add_circle',
  ButtonGroup: 'group',
  IconButton: 'apps',
  ToggleIconButton: 'toggle_on',
  Toolbar: 'build',
  Autocomplete: 'search',
  Checkbox: 'check_box',
  Chips: 'label',
  ChipSet: 'view_list',
  ColorPicker: 'palette',
  DatePicker: 'calendar_month',
  DropZone: 'upload_file',
  Field: 'input',
  FileUpload: 'file_upload',
  Form: 'assignment',
  NumericField: 'pin',
  Radio: 'radio',
  Select: 'list',
  Slider: 'tune',
  Switch: 'toggle_on',
  TextField: 'text_fields',
  TimePicker: 'schedule',
  AppBar: 'web_asset',
  Breadcrumbs: 'route',
  Carousel: 'view_carousel',
  Drawer: 'menu_open',
  ExpansionPanels: 'expand_more',
  List: 'list',
  Menu: 'menu',
  NavMenu: 'account_tree',
  Pagination: 'pages',
  Tabs: 'tab',
  TreeView: 'account_tree',
  Avatar: 'account_circle',
  Badge: 'label',
  Card: 'credit_card',
  Icons: 'category',
  Rating: 'star',
  Alert: 'warning',
  Dialog: 'dialogs',
  MessageBox: 'announcement',
  Overlay: 'layers',
  Popover: 'open_in_new',
  Progress: 'progress_activity',
  Snackbar: 'chat',
  Tooltip: 'help',
  BarChart: 'bar_chart',
  DataGrid: 'table_view',
  DonutChart: 'donut_large',
  LineChart: 'show_chart',
  PieChart: 'pie_chart',
  SimpleTable: 'table_rows',
  StackedBarChart: 'stacked_bar_chart',
  Table: 'table',
  Timeline: 'timeline'
};
function componentIcon(name) {
  return componentIcons[name] || 'widgets';
}
const categoryIcons = {
  'Foundations/Layout': 'foundation', Actions: 'bolt', 'Inputs/Forms': 'input',
  'Navigation/Disclosure': 'navigation', 'Surfaces/Content': 'layers',
  'Feedback/Overlays': 'notifications', 'Data/Visualization': 'bar_chart'
};

function navigationIcon(slug, label, type) {
  if (type === 'icons') return 'category';
  if (type === 'category') {
    const category = Object.keys(categories).find(item => catSlug(item) === slug);
    return categoryIcons[category] || 'widgets';
  }
  if (type === 'component') return componentIcon(label);
  if (type === 'guidance') return 'menu_book';
  return 'explore';
}
const navigationStateKey = 'thiscloud-ui-expanded-categories';
function readExpandedCategories() {
  const valid = new Set(Object.keys(categories).map(catSlug));
  const state = {};
  try {
    const stored = JSON.parse(localStorage.getItem(navigationStateKey) || '{}');
    if (stored && typeof stored === 'object' && !Array.isArray(stored)) {
      for (const key of valid) if (typeof stored[key] === 'boolean') state[key] = stored[key];
    }
  } catch (_) { /* Invalid local state is intentionally ignored. */ }
  return state;
}
function writeExpandedCategories(state) {
  try { localStorage.setItem(navigationStateKey, JSON.stringify(state)); } catch (_) { /* Storage is optional. */ }
}
let expandedCategories = readExpandedCategories();

function renderNavigationLink(slug, label, type) {
  const prefix = type === 'category' ? 'category/' : type === 'component' ? 'component/'
    : type === 'guidance' ? 'guidance/' : '';
  const className = type === 'component' ? 'component' : '';
  return `<a class="${className}" href="#${prefix}${slug}">${icon(navigationIcon(slug, label, type))}<span>${esc(label)}</span></a>`;
}

function renderCategoryBranch(category) {
  const slug = catSlug(category);
  const label = t('nav.categories.' + category);
  const groupId = `nav-category-${slug}`;
  const expanded = expandedCategories[slug] === true;
  const children = categories[category].map(name => {
    const record = itemFor(name);
    return renderNavigationLink(record.slug, name, 'component');
  }).join('');
  return `<div class="nav-category" data-category-slug="${slug}"><div class="nav-category-row">`
    + `${renderNavigationLink(slug, label, 'category')}`
    + `<button type="button" class="nav-category-toggle" data-category-toggle="${slug}" aria-expanded="${expanded}" aria-controls="${groupId}" aria-label="${esc((expanded ? t('nav.collapseCategory') : t('nav.expandCategory')).replace('{category}', label))}">${icon('expand_more')}</button>`
    + `</div><div class="nav-category-children" id="${groupId}" role="group"${expanded ? '' : ' hidden'}>${children}</div></div>`;
}

function renderSemanticNavigation() {
  const simpleGroups = [
    [t('nav.explore'), [renderNavigationLink('explore', t('nav.explore'), 'explore')]],
    [t('nav.guidance'), [
      renderNavigationLink('download', t('nav.download'), 'guidance'),
      renderNavigationLink('getting-started', t('nav.gettingStarted'), 'guidance'),
      renderNavigationLink('customization', t('nav.customization'), 'guidance'),
      renderNavigationLink('accessibility', t('nav.accessibility'), 'guidance'),
      renderNavigationLink('build-status', t('nav.buildStatus'), 'guidance')
    ]],
    [t('nav.icons'), [renderNavigationLink('icons', t('nav.icons'), 'icons')]]
  ];
  const components = Object.keys(categories).map(renderCategoryBranch).join('');
  const groups = [simpleGroups[0], [t('nav.components'), [components]], simpleGroups[1], simpleGroups[2]];
  document.getElementById('sideNav').innerHTML = groups.map(([heading, content]) => `
    <section class="nav-section"><div class="nav-label">${esc(heading)}</div>
      <nav class="nav" aria-label="${esc(heading)}">${content.join('')}</nav></section>`).join('');
  document.querySelectorAll('[data-category-toggle]').forEach(toggle => {
   toggle.onclick = () => {
     const slug = toggle.dataset.categoryToggle;
     expandedCategories[slug] = toggle.getAttribute('aria-expanded') !== 'true';
     writeExpandedCategories(expandedCategories);
     updateNavigationBranches();
   };
    toggle.onkeydown = event => {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      toggle.click();
    };
  });
  updateNavigationBranches();
}

function updateNavigationBranches() {
  const hash = location.hash.slice(1);
  const active = itemFor(hash.startsWith('component/') ? hash.slice(10) : '');
  const activeCategory = active ? catSlug(active.category) : hash.startsWith('category/') ? hash.slice(9) : '';
  if (activeCategory && Object.prototype.hasOwnProperty.call(categories, Object.keys(categories).find(key => catSlug(key) === activeCategory))) {
    expandedCategories[activeCategory] = true;
  }
  document.querySelectorAll('[data-category-toggle]').forEach(toggle => {
    const expanded = expandedCategories[toggle.dataset.categoryToggle] === true;
    toggle.setAttribute('aria-expanded', String(expanded));
    const label = toggle.closest('.nav-category')?.querySelector('.nav-category-row > a span')?.textContent || '';
    toggle.setAttribute('aria-label', (expanded ? t('nav.collapseCategory') : t('nav.expandCategory')).replace('{category}', label));
    const group = document.getElementById(toggle.getAttribute('aria-controls'));
    if (group) group.hidden = !expanded;
  });
}
function renderTabsDemo() {
  const demoCopy = t('demo');
  const labels = [demoCopy.overview, demoCopy.activity, demoCopy.settings];
  const tabs = labels.map((label, index) => {
    const active = index === 0;
    const state = active ? 'var(--raised)' : 'transparent';
    const color = active ? 'var(--text)' : 'var(--muted)';
    return [
      `<button class="tab ${active ? 'active' : ''}" role="tab" aria-selected="${active}"`,
      `style="border:0;border-bottom:2px solid ${active ? 'var(--accent)' : 'transparent'};`,
      `background:${state};color:${color};padding:8px 14px;border-radius:6px 6px 0 0;`,
      `font-weight:${active ? '700' : '400'}">${label}</button>`
    ].join('');
  }).join('');
  return [
    '<div class="fake-card demo-row tabs-demo" role="tablist" aria-label="Tabs"',
    ' style="align-items:stretch;gap:0;padding:6px">', tabs, '</div>'
  ].join('');
}

function renderEnhancedDemo(name, variant = 'overview') {
  if (name === 'Tabs') return renderTabsDemo();
  if (name === 'DataGrid') return renderDataGridDemo(variant);
  return legacyDemo(name, variant);
}
function renderDataGridDemo(variant) {
  const d = t('demo').grid;
  const rows = [[d.aurora, d.foundationTeam, d.active],
    [d.project + ' Core', d.aurora, d.reviewStatus],
    [d.project + ' Docs', d.foundationTeam, d.readyStatus]];
  const selected = variant === 'states' ? 1 : -1;
  const gridId = `datagrid-${variant}`;
  const headers = [d.project, d.owner, d.statusColumn];
  const headerMarkup = headers.map((label, col) => {
    const sorted = col === 0 ? ' aria-sort="ascending"' : '';
    const indicator = col === 0 ? '▲' : '';
    const tabIndex = col === 0 ? 0 : -1;
    return `<th scope="col" id="${gridId}-col-${col}"${sorted}><button type="button" data-grid-cell data-grid-header `
      + `data-col="${col}" tabindex="${tabIndex}" data-sort-indicator="${indicator}" `
      + `aria-label="${label}">${label}</button></th>`;
  }).join('');
  const bodyMarkup = rows.map((row, index) => `<tr data-grid-row="${index}" `
    + `aria-selected="${index === selected}">${row.map((value, col) => `<td headers="${gridId}-col-${col}" `
      + `data-grid-cell data-row="${index}" data-col="${col}" tabindex="-1">${value}</td>`).join('')}</tr>`).join('');
  return `<div class="data-grid-demo" data-datagrid data-grid-variant="${variant}">`
    + `<table role="grid" aria-label="${d.label}" aria-describedby="grid-instructions-${variant}">`
    + `<caption class="sr-only" id="grid-instructions-${variant}">${d.instructions}</caption>`
    + `<thead><tr>${headerMarkup}</tr></thead><tbody>${bodyMarkup}</tbody></table>`
    + `<div class="sr-only" data-grid-instructions>${d.instructions}</div>`
    + `<div class="grid-status" role="status" aria-live="polite" data-grid-status>${selected >= 0
      ? d.selected.replace('{name}', rows[selected][0]) : d.notSelected}</div></div>`;
}
let passiveTableInstance = 0;
function passiveTableDemo(name, variant) {
  const d = t('demo')[name === 'SimpleTable' ? 'simpleTable' : 'table'];
  const id = `${name.toLowerCase()}-${variant}-${++passiveTableInstance}`;
  const empty = variant === 'states';
  const headers = [d.project, d.status, d.owner];
  const rows = [[d.aurora, d.active, d.team], [d.core, d.review, d.platform], [d.docs, d.ready, d.team]];
  const head = headers.map(label => `<th scope="col">${label}</th>`).join('');
  const body = empty
    ? `<tr><td colspan="3">${d.empty}</td></tr>`
    : rows.map(row => name === 'Table'
      ? `<tr><th scope="row">${row[0]}</th><td class="status-text">${row[1]}</td><td>${row[2]}</td></tr>`
      : `<tr><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td></tr>`).join('');
  const caption = empty ? d.emptyCaption : d.caption;
  return `<div class="table-demo-wrap" tabindex="0" aria-label="${d.wrapper}">`
    + `<table class="table-demo" id="${id}" aria-describedby="${id}-caption">`
    + `<caption id="${id}-caption">${caption}</caption><thead><tr>${head}</tr></thead>`
    + `<tbody>${body}</tbody></table></div>`;
}
function timelineDemo(variant) {
  const d = t('demo').timeline;
  const events = [
    [d.createdHeading, '2025-01-15T09:15:00Z', d.createdDate, d.completed, d.createdDetail, 'check_circle'],
    [d.reviewingHeading, '2025-01-16T14:30:00Z', d.reviewingDate, d.current, d.reviewingDetail, 'sync'],
    [d.publishedHeading, '2025-01-18T11:00:00Z', d.publishedDate, d.upcoming,
      d.publishedDetail, 'radio_button_unchecked']
  ];
  const items = events.map((event, index) => `<li${index === 1 ? ' aria-current="step"' : ''}>`
    + `<span class="timeline-marker" aria-hidden="true">${icon(event[5])}</span><article><h3>${event[0]}</h3>`
    + `<p><time datetime="${event[1]}">${event[2]}</time> · <strong>${event[3]}</strong></p>`
    + `<p>${event[4]}</p></article></li>`).join('');
  return `<div class="timeline-demo"><ol aria-label="${d[variant]}">${items}</ol></div>`;
}
function wireDataGrids() {
  const view = document.getElementById('view');
  view?.querySelectorAll('[data-datagrid]').forEach(root => {
    const cells = () => [...root.querySelectorAll('[data-grid-cell]')];
    const copy = () => t('demo').grid;
    const announce = text => { root.querySelector('[data-grid-status]').textContent = text; };
    const focusCell = (cell, reveal = true) => {
      cells().forEach(item => { item.tabIndex = item === cell ? 0 : -1; });
      cell.focus();
      if (reveal) {
        const wrap = cell.closest('.demo');
        const box = cell.getBoundingClientRect(), area = wrap?.getBoundingClientRect();
        if (wrap && area && box.right > area.right) wrap.scrollLeft += box.right - area.right + 16;
        if (wrap && area && box.left < area.left) wrap.scrollLeft -= area.left - box.left + 16;
      }
    };
    const selectRow = row => {
      const selected = row.getAttribute('aria-selected') !== 'true';
      root.querySelectorAll('[data-grid-row]').forEach(item => {
        item.setAttribute('aria-selected', String(selected && item === row));
      });
      announce(selected ? copy().selected.replace('{name}', row.cells[0].textContent) : copy().notSelected);
    };
    const sort = header => {
      const col = Number(header.dataset.col);
      const th = header.closest('th');
      const ascending = th.getAttribute('aria-sort') !== 'ascending';
      root.querySelectorAll('th').forEach(item => item.removeAttribute('aria-sort'));
      th.setAttribute('aria-sort', ascending ? 'ascending' : 'descending');
      root.querySelectorAll('[data-grid-header]').forEach(item => { item.dataset.sortIndicator = ''; });
      header.dataset.sortIndicator = ascending ? '▲' : '▼';
      const body = root.querySelector('tbody');
      [...body.rows].sort((a, b) => a.cells[col].textContent.localeCompare(b.cells[col].textContent)
        * (ascending ? 1 : -1)).forEach((row, index) => {
          row.dataset.gridRow = index;
          row.querySelectorAll('[data-grid-cell]').forEach(cell => { cell.dataset.row = index; });
          body.append(row);
        });
      focusCell(header, false);
      announce(copy().sorted.replace('{column}', header.textContent).replace('{direction}',
        ascending ? copy().ascending : copy().descending));
    };
    root.onclick = event => {
      const cell = event.target.closest('[data-grid-cell]');
      if (!cell) return;
      if (cell.dataset.gridHeader !== undefined) sort(cell);
      else selectRow(cell.closest('[data-grid-row]'));
    };
    root.onkeydown = event => {
      const cell = event.target.closest('[data-grid-cell]');
      if (!cell) return;
      if (cell.dataset.gridHeader !== undefined && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault(); sort(cell); return;
      }
      if (cell.dataset.gridHeader === undefined && event.shiftKey && event.key === ' ') {
        event.preventDefault(); selectRow(cell.closest('[data-grid-row]')); return;
      }
      const row = cell.dataset.gridHeader !== undefined ? -1 : Number(cell.dataset.row);
      const col = Number(cell.dataset.col), lastRow = root.querySelectorAll('tbody tr').length - 1;
      let nextRow = row, nextCol = col;
      if (event.key === 'ArrowRight') nextCol = Math.min(2, col + 1);
      if (event.key === 'ArrowLeft') nextCol = Math.max(0, col - 1);
      if (event.key === 'ArrowDown') nextRow = Math.min(lastRow, row + 1);
      if (event.key === 'ArrowUp') nextRow = Math.max(-1, row - 1);
      if (event.key === 'Home') nextCol = 0;
      if (event.key === 'End') nextCol = 2;
      if (event.ctrlKey && event.key === 'Home') { nextRow = -1; nextCol = 0; }
      if (event.ctrlKey && event.key === 'End') { nextRow = lastRow; nextCol = 2; }
      if (nextRow !== row || nextCol !== col) {
        event.preventDefault();
        const selector = nextRow < 0 ? `[data-grid-header][data-col="${nextCol}"]`
          : `[data-grid-row="${nextRow}"] [data-col="${nextCol}"]`;
        focusCell(root.querySelector(selector));
      }
    };
  });
}
function wirePassiveTableScrolling() {
  const view = document.getElementById('view');
  view?.querySelectorAll('.table-demo-wrap').forEach(wrap => {
    wrap.onkeydown = event => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      const max = wrap.scrollWidth - wrap.clientWidth, before = wrap.scrollLeft;
      const delta = event.key === 'ArrowRight' ? 40 : -40;
      const next = Math.max(0, Math.min(max, before + delta));
      if (next !== before) { event.preventDefault(); wrap.scrollLeft = next; }
    };
  });
}
// The former inline scripts now share one classic bundle scope, not window properties.
const legacyDemo = demo;
const legacyExplore = explore;
const legacyRender = render;
const legacyWireSearch = wireSearch;

// Restore classic-script dispatch: legacy wrappers retain the original functions above.
nav = window.nav = renderSemanticNavigation;
demo = window.demo = renderEnhancedDemo;
explore = window.explore = renderEnhancedExplore;
render = window.render = renderWithSemanticContext;
wireSearch = window.wireSearch = wireSemanticSearch;

const categoryPreviewComponents = {
  'Foundations/Layout': 'Grid',
  Actions: 'ButtonGroup',
  'Inputs/Forms': 'ColorPicker',
  'Navigation/Disclosure': 'Tabs',
  'Surfaces/Content': 'Card',
  'Feedback/Overlays': 'Alert',
  'Data/Visualization': 'SimpleTable'
};

function componentCardHeading(name, iconName = componentIcon(name)) {
  return `<h3><span class="component-heading-icon">${icon(iconName)}</span>${esc(name)}</h3>`;
}

function renderCompactCategoryPreview(category) {
  const d = t('demo');
  if (category === 'Actions') return `<div class="compact-action-preview" role="group" aria-label="${esc(t('actions.ButtonGroup.groupName'))}">`
    + [d.overview, d.activity, d.settings].map((label, index) => `<button type="button" class="btn ${index === 0 ? 'primary' : ''}">${esc(label)}</button>`).join('') + '</div>';
  if (category === 'Surfaces/Content') return `<article class="compact-card-preview"><strong>${esc(d.usageSummary)}</strong>`
    + `<p>${esc(d.boundedContent)}</p><span class="pill info">${esc(d.view)}</span></article>`;
  if (category !== 'Inputs/Forms') return null;
  return `<div class="compact-input-preview"><label><span>${esc(d.brandColor)}</span>`
    + `<input type="color" value="#5946b2" aria-label="${esc(d.brandColor)}"></label>`
    + `<span class="pill info">#5946B2</span></div>`;
}

function renderCategoryCard(category, names, copy) {
  const previewName = categoryPreviewComponents[category] || names[0];
  const compactPreview = renderCompactCategoryPreview(category);
  return `<a class="card category-card" data-category-card href="#category/${catSlug(category)}">`
    + `<div class="category-preview" data-preview-component="${previewName}">${compactPreview || renderEnhancedDemo(previewName)}</div>`
    + `<div class="card-body">${componentCardHeading(copy, categoryIcons[category])}<p>${names.length} ${esc(t('explore.documented'))}.</p>`
    + `<span class="pill info" data-card-cta>${esc(t('explore.openCategory'))}</span></div></a>`;
}

function renderFeaturedCard(name) {
  const record = itemFor(name);
  return `<a class="card featured-card" href="#component/${record.slug}">`
    + `<div class="featured-preview">${renderEnhancedDemo(name)}</div>`
    + `<div class="card-body">${componentCardHeading(name)}`
    + `${badge(routeStatus(name))}</div></a>`;
}

function renderEnhancedExplore() {
  const e = t('explore');
  const categoryCards = Object.entries(categories)
    .map(([category, names]) => renderCategoryCard(category, names, t('nav.categories.' + category)))
    .join('');
  const featured = ['Button', 'TextField', 'Card', 'Alert', 'Tabs', 'BarChart']
    .map(renderFeaturedCard).join('');
  return `<section class="hero"><div class="eyebrow">${esc(e.eyebrow)}</div><h1>${esc(e.title)}</h1>`
    + `<p>${esc(e.intro)}</p><div class="actions"><a class="btn primary" href="#category/foundations-layout">${esc(e.foundations)}</a>`
    + `<a class="btn" href="#guidance/getting-started">${esc(e.gettingStarted)}</a>`
    + `<button class="btn" type="button" data-dialog>${esc(e.tryDialog)}</button></div></section>`
    + `<div class="section-title"><h2>${esc(e.browse)}</h2></div>`
    + `<p class="section-intro">${esc(e.browseIntro)}</p><div class="grid explore-category-grid">${categoryCards}</div>`
    + `<div class="section-title"><h2>${esc(e.featured)}</h2></div><p class="section-intro">${esc(e.featuredIntro)}</p>`
    + `<div class="component-grid explore-featured-grid">${featured}</div>`;
}

function addComponentHeadingIcon() {
  const hash = location.hash.slice(1);
  const item = hash.startsWith('component/') && itemFor(hash.slice(10));
  const heading = document.querySelector('.page-head h1');
  if (item && heading && !heading.querySelector('.component-heading-icon')) {
    const marker = `<span class="component-heading-icon">${icon(componentIcon(item.name))}</span>`;
    heading.insertAdjacentHTML('afterbegin', marker);
  }
}

function renderWithSemanticContext() {
  if (location.hash === '#main') history.replaceState(null, '', '#explore');
  legacyRender();
  const item = itemFor(location.hash.slice(11));
  if (item && !item.api) {
    document.querySelectorAll('.foundation-detail').forEach((detail) => {
      [...detail.querySelectorAll('strong')].filter((heading) => heading.textContent === t('component.sections.api')).forEach((heading) => heading.nextElementSibling?.remove() || heading.remove());
    });
    document.querySelectorAll('.code-toggle').forEach((toggle) => {
      toggle.onclick = () => { toggle.insertAdjacentHTML('afterend', `<p class="muted">${esc(t('component.demoCodeBoundary'))}</p>`); toggle.disabled = true; };
    });
    const identity = new RegExp(`Tc${item.name}|tc\\.ui\\.${item.slug}`, 'g');
    const walker = document.createTreeWalker(document.querySelector('.component-layout'), NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) node.textContent = node.textContent.replace(identity, t('component.demoReference'));
  }
  updateNavigationBranches();
  wireNavigationDemos();
  wireDataGrids();
  wirePassiveTableScrolling();
  addComponentHeadingIcon();
}

function addSearchResultIcons() {
  const box = document.getElementById('searchResults');
  box.querySelectorAll('a.search-result').forEach(result => {
    const record = itemFor(result.querySelector('strong')?.textContent);
    if (record && !result.querySelector('.component-heading-icon')) {
      result.querySelector('strong').insertAdjacentHTML(
        'beforebegin',
        `<span class="component-heading-icon">${icon(componentIcon(record.name))}</span>`
      );
    }
  });
}

function wireSemanticSearch() {
  legacyWireSearch();
  const input = document.getElementById('globalSearch');
  const updateResults = input.oninput;
  input.oninput = () => {
    updateResults();
    addSearchResultIcons();
  };
}

document.getElementById('skip').addEventListener('click', event => {
  event.preventDefault();
  document.getElementById('main').focus();
});
Object.assign(window.ThiscloudCatalog.assertions, {
  actualPublicRoutes: Object.keys(publicWebApi).map((name) => itemFor(name).slug),
  demoOnlyCount: all.filter((record) => !record.api).length,
});
window.onhashchange = () => { if (location.hash !== '#main') window.render(); };
