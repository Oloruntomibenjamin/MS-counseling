(function(){
			const btn = document.getElementById('hamburger');
			const mobile = document.getElementById('mobileNav');

			function toggleMenu(){
				const open = mobile.classList.toggle('open');
				btn.classList.toggle('is-active');
				btn.setAttribute('aria-expanded', open ? 'true' : 'false');
				mobile.setAttribute('aria-hidden', open ? 'false' : 'true');
			}

			btn.addEventListener('click', toggleMenu);

			// Close on ESC or when clicking outside mobile menu (for accessibility)
			document.addEventListener('keydown', (e)=>{
				if(e.key === 'Escape' && mobile.classList.contains('open')) toggleMenu();
			});

			document.addEventListener('click', (e)=>{
				if(!mobile.classList.contains('open')) return;
				const target = e.target;
				if(target.closest('#mobileNav')) return; // click inside
				if(target.closest('#hamburger')) return; // click hamburger
				toggleMenu();
			});
		})();
	
		// Hotline modal behavior: open, close, overlay click, ESC, and focus restore
		(function(){
			const overlay = document.getElementById('hotlineOverlay');
			const openBtn = document.getElementById('hotlineBtn');
			const openBtnMobile = document.getElementById('hotlineBtnMobile');
			const closeBtn = document.getElementById('hotlineClose');
			let lastFocused = null;

			if(!overlay) return;

			function openHotline(){
				lastFocused = document.activeElement;
				overlay.classList.add('show');
				overlay.setAttribute('aria-hidden','false');
				// focus close button for keyboard users
				if(closeBtn) closeBtn.focus();
				document.addEventListener('keydown', handleKeydown);
			}

			function closeHotline(){
				overlay.classList.remove('show');
				overlay.setAttribute('aria-hidden','true');
				document.removeEventListener('keydown', handleKeydown);
				if(lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
			}

			function handleKeydown(e){
				if(e.key === 'Escape'){
					closeHotline();
					return;
				}
				// simple focus trap: keep focus inside modal when open
				if(e.key === 'Tab'){
					const focusable = overlay.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
					if(focusable.length === 0) return;
					const first = focusable[0];
					const last = focusable[focusable.length -1];
					if(e.shiftKey && document.activeElement === first){
						e.preventDefault(); last.focus();
					} else if(!e.shiftKey && document.activeElement === last){
						e.preventDefault(); first.focus();
					}
				}
			}

			// Overlay click closes when clicking outside modal
			overlay.addEventListener('click', function(e){
				if(e.target === overlay) closeHotline();
			});

			if(openBtn) openBtn.addEventListener('click', function(e){ e.preventDefault(); openHotline(); });
			if(openBtnMobile) openBtnMobile.addEventListener('click', function(e){ e.preventDefault(); openHotline(); });

			// Any link that targets #book should open the hotline modal instead
			const bookLinks = document.querySelectorAll('a[href="#book"]');
			bookLinks.forEach(function(link){
				link.addEventListener('click', function(e){
					e.preventDefault();
					openHotline();
				});
			});
			if(closeBtn) closeBtn.addEventListener('click', function(e){ e.preventDefault(); closeHotline(); });
		})();
	
		// Contact form handler: show success toast and reset
		(function(){
			const form = document.getElementById('contactForm');
			if(!form) return;
			const toast = document.createElement('div');
			toast.className = 'form-success';
			toast.textContent = 'Message sent — we will contact you shortly.';
			document.body.appendChild(toast);

			form.addEventListener('submit', function(e){
				e.preventDefault();
				const submit = form.querySelector('.btn-submit');
				submit.disabled = true;
				submit.style.transform = 'scale(.98)';

				// simulate request
				setTimeout(()=>{
					form.reset();
					submit.disabled = false;
					submit.style.transform = '';
					toast.classList.add('show');
					setTimeout(()=>toast.classList.remove('show'), 3200);
				}, 800);
			});
		})();