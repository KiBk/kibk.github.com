/*!
    Title: Dev Portfolio Template
    Version: 1.2.2
    Last Change: 03/25/2020
    Author: Ryan Fitzgerald
    Repo: https://github.com/RyanFitzgerald/devportfolio-template
    Issues: https://github.com/RyanFitzgerald/devportfolio-template/issues

    Description: This file contains all the scripts associated with the single-page
    portfolio website.
*/

(function($) {
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var cvUrl = 'https://drive.google.com/file/d/1VMUJ1DpWQwMqXVmJBZzRIiAu3b4kBlfH/view?usp=sharing';
    var shellHost = 'kibk.net';
    var defaultShellUser = 'user';
    var ownerShellUser = 'kibk';
    var sectionTargets = {
        about: '#about',
        experience: '#experience',
        education: '#education',
        projects: '#projects',
        skills: '#skills',
        contact: '#contact',
        home: '#lead',
        top: 'top'
    };

    var terminalResponses = {
        help: [
            'Commands:',
            '<span class="terminal-highlight">about</span> <span class="terminal-highlight">experience</span> <span class="terminal-highlight">education</span> <span class="terminal-highlight">projects</span> <span class="terminal-highlight">skills</span> <span class="terminal-highlight">contact</span>',
            '<span class="terminal-highlight">cd about</span> <span class="terminal-highlight">cd projects</span> <span class="terminal-highlight">cd contact</span> and <span class="terminal-highlight">cd home</span> navigate the page.',
            '<span class="terminal-highlight">cv</span> opens the resume link. <span class="terminal-highlight">clear</span> resets the terminal.'
        ],
        about: [
            'Embedded and infrastructure engineer based in Trondheim.',
            'Worked across RTL design, verification, DevOps, and developer enablement.',
            'Now focused on AI-assisted engineering workflows for hardware design.'
        ],
        experience: [
            'Arm: promoted to Staff Engineer in April 2026 after serving as Senior Engineer.',
            'Current focus: using AI to make hardware design work simpler.',
            'Nordic Semiconductor: moved from digital design and verification into DevOps and design enablement.',
            'The through-line is developer productivity for hardware teams.'
        ],
        education: [
            'MSc work focused on embedded computing systems, SystemC/TLM, and verification.',
            'Academic projects covered FPGA, digital systems, cryptography, and architecture.',
            'There is more detail in the education cards below.'
        ],
        projects: [
            'Homelab: self-hosted infrastructure playground.',
            'Attempt at soldering: custom keyboards built around nRF52 boards.',
            'High-level verification environment: faster hybrid RTL/SystemC validation.',
            'Scroll down for the full project cards and expandable details.'
        ],
        skills: [
            'Core: C++, Python, Git, Shell, JavaScript.',
            'Infra: Docker, Terraform, Ansible, Azure, CI/CD.',
            'Hardware: FPGA, Verilog, SystemVerilog, VHDL, SVA, SystemC.'
        ],
        contact: [
            'Use the contact form below for the easiest path.',
            'You can also find me on <a href="https://github.com/kibk" target="_blank" rel="noopener noreferrer">GitHub</a> and <a href="https://linkedin.com/in/mrkirillbykov/" target="_blank" rel="noopener noreferrer">LinkedIn</a>.'
        ],
        cv: [
            'Open the CV here: <a href="' + cvUrl + '" target="_blank" rel="noopener noreferrer">View CV</a>.'
        ],
        coffee: [
            'Brewing...',
            'Done. Latency improved by approximately one espresso.'
        ]
    };

    var terminalAliases = {
        exp: 'experience',
        edu: 'education',
        project: 'projects',
        resume: 'cv',
        whoami: 'whoami'
    };

    var $html = $('html');
    var $body = $('body');
    var $header = $('header');
    var $mobileMenuOpen = $('#mobile-menu-open');
    var $mobileMenuClose = $('#mobile-menu-close');
    var $heroTerminal = $('#hero-terminal');
    var $terminalPrompt = $('#terminal-prompt');
    var $terminalOutput = $('#terminal-output');
    var $terminalForm = $('#terminal-form');
    var $terminalInput = $('#terminal-input');
    var $terminalDockToggle = $('#terminal-dock-toggle');
    var $terminalReturnHome = $('#terminal-return-home');
    var initialTerminalHtml = $terminalOutput.html();
    var commandHistory = [];
    var historyIndex = 0;
    var currentShellUser = defaultShellUser;
    var dockHintShown = false;

    function escapeHtml(value) {
        return $('<div>').text(value).html();
    }

    function getShellPromptText() {
        return currentShellUser + '@' + shellHost + ':~$';
    }

    function getShellPromptMarkup() {
        return '<span class="terminal-highlight">' + escapeHtml(getShellPromptText()) + '</span>';
    }

    function syncTerminalPrompt() {
        if ($terminalPrompt.length) {
            $terminalPrompt.text(getShellPromptText());
        }
    }

    function getWhoAmIResponse() {
        if (currentShellUser === ownerShellUser) {
            return [
                currentShellUser,
                'Site owner session unlocked.',
                'Hardware / Software Engineer focused on AI-assisted engineering workflows, embedded systems, and developer tooling.'
            ];
        }

        return [
            currentShellUser,
            'Guest shell session on ' + shellHost + '.',
            'Use <span class="terminal-highlight">cd about</span> to learn who built the site.'
        ];
    }

    function isCoarsePointer() {
        return window.matchMedia('(pointer: coarse)').matches;
    }

    function getScrollOffset() {
        if (window.innerWidth <= 900) {
            return 24;
        }

        return ($('#menu').outerHeight() || 0) + 34;
    }

    function scrollToTarget(targetSelector) {
        var targetTop;

        if (targetSelector === 'top') {
            targetTop = 0;
        } else {
            var $target = $(targetSelector);

            if (!$target.length) {
                return;
            }

            targetTop = Math.max($target.offset().top - getScrollOffset(), 0);
        }

        if (prefersReducedMotion) {
            window.scrollTo(0, targetTop);
            return;
        }

        $('html, body').stop().animate({
            scrollTop: targetTop
        }, 500);
    }

    function openMobileMenu() {
        $header.addClass('active');
        $body.addClass('active');
        $mobileMenuOpen.attr('aria-expanded', 'true');
    }

    function closeMobileMenu() {
        $header.removeClass('active');
        $body.removeClass('active');
        $mobileMenuOpen.attr('aria-expanded', 'false');
    }

    function appendTerminalLine(type, content) {
        $('<p>', {
            'class': 'terminal-line' + (type ? ' ' + type : ''),
            html: content
        }).appendTo($terminalOutput);
        $terminalOutput.scrollTop($terminalOutput[0].scrollHeight);
    }

    function appendTerminalResponse(lines, type) {
        $.each(lines, function(_, line) {
            appendTerminalLine(type || '', line);
        });
    }

    function resetTerminal() {
        $terminalOutput.html(initialTerminalHtml);
        syncTerminalPrompt();
        $terminalOutput.scrollTop($terminalOutput[0].scrollHeight);
    }

    function normalizeCommand(command) {
        return $.trim(command).toLowerCase().replace(/\s+/g, ' ');
    }

    function maybeFocusTerminal() {
        if ($body.hasClass('terminal-docked') && !$body.hasClass('terminal-expanded')) {
            return;
        }

        if (!isCoarsePointer() && window.innerWidth > 900) {
            $terminalInput.trigger('focus');
        }
    }

    function isTerminalDocked() {
        return $body.hasClass('terminal-docked');
    }

    function isTerminalExpanded() {
        return $body.hasClass('terminal-expanded');
    }

    function syncTerminalDockControls() {
        if (!$terminalDockToggle.length) {
            return;
        }

        if (isTerminalExpanded()) {
            $terminalDockToggle.text('Min');
            $terminalDockToggle.attr('aria-label', 'Collapse terminal');
            return;
        }

        $terminalDockToggle.text('Open');
        $terminalDockToggle.attr('aria-label', 'Expand terminal');
    }

    function syncTerminalDockLayout() {
        if (!$heroTerminal.length) {
            return;
        }

        if (!isTerminalDocked() || window.innerWidth <= 900) {
            $heroTerminal.css({
                width: '',
                maxWidth: ''
            });
            return;
        }

        $heroTerminal.css({
            width: '360px',
            maxWidth: '360px'
        });
    }

    function collapseDockedTerminal() {
        if (!isTerminalDocked()) {
            return;
        }

        $body.removeClass('terminal-expanded');
        syncTerminalDockControls();
        syncTerminalDockLayout();
    }

    function expandDockedTerminal() {
        if (!isTerminalDocked()) {
            return;
        }

        $body.addClass('terminal-expanded');
        syncTerminalDockControls();
        syncTerminalDockLayout();
        maybeFocusTerminal();
    }

    function dockTerminal() {
        if (!isTerminalDocked()) {
            $body.addClass('terminal-docked');
        }

        collapseDockedTerminal();

        if (!dockHintShown) {
            appendTerminalResponse([
                'Terminal docked. Select it or press <span class="terminal-highlight">Open</span> to keep typing.',
                'Use <span class="terminal-highlight">cd home</span> or <span class="terminal-highlight">Hero</span> to bring it back to the intro.'
            ], 'system');
            dockHintShown = true;
        }
    }

    function restoreTerminalToHero() {
        $body.removeClass('terminal-docked terminal-expanded');
        syncTerminalDockControls();
        syncTerminalDockLayout();
    }

    function returnTerminalHome() {
        restoreTerminalToHero();
        scrollToTarget(sectionTargets.home);

        if (prefersReducedMotion) {
            maybeFocusTerminal();
            return;
        }

        window.setTimeout(function() {
            maybeFocusTerminal();
        }, 540);
    }

    function handleUserSwitchCommand(command) {
        var targetUser = $.trim(command.slice(2));

        if (!targetUser) {
            appendTerminalResponse([
                'Specify a username, for example <span class="terminal-highlight">su kibk</span>.'
            ], 'system');
            return true;
        }

        if (!/^[a-z_][a-z0-9._-]{0,31}$/.test(targetUser)) {
            appendTerminalResponse([
                'Invalid username: <span class="terminal-highlight">' + escapeHtml(targetUser) + '</span>.'
            ], 'system');
            return true;
        }

        currentShellUser = targetUser;
        syncTerminalPrompt();

        if (currentShellUser === ownerShellUser) {
            appendTerminalResponse([
                'Identity switched to <span class="terminal-highlight">' + escapeHtml(currentShellUser) + '</span>.',
                'Owner profile unlocked.'
            ], 'secret');
            return true;
        }

        appendTerminalResponse([
            'Identity switched to <span class="terminal-highlight">' + escapeHtml(currentShellUser) + '</span>.'
        ], 'system');
        return true;
    }

    function handleNavigationCommand(command) {
        var parts = command.split(' ');
        var action = parts[0];
        var destination = parts.slice(1).join(' ');

        if (!destination) {
            appendTerminalResponse([
                'Specify a destination, for example <span class="terminal-highlight">cd projects</span>.'
            ], 'system');
            return true;
        }

        if (action === 'cd') {
            if (destination === '..' || destination === '~' || destination === '/') {
                destination = 'home';
            } else if (destination.charAt(0) === '/') {
                destination = destination.slice(1);
            }
        }

        if (destination === 'cv' || destination === 'resume') {
            if (action === 'open') {
                window.open(cvUrl, '_blank', 'noopener');
            }

            appendTerminalResponse(terminalResponses.cv);
            return true;
        }

        if (sectionTargets[destination]) {
            appendTerminalResponse([
                'Changed directory to <span class="terminal-highlight">' + escapeHtml(destination) + '</span>.'
            ], 'system');

            if (destination === 'home' || destination === 'top') {
                returnTerminalHome();
                return true;
            }

            scrollToTarget(sectionTargets[destination]);

            window.setTimeout(function() {
                dockTerminal();
            }, prefersReducedMotion ? 0 : 180);

            return true;
        }

        return false;
    }

    function handleTerminalCommand(rawCommand) {
        var normalized = normalizeCommand(rawCommand);
        var resolvedCommand = terminalAliases[normalized] || normalized;

        if (!normalized) {
            return;
        }

        appendTerminalLine('command', getShellPromptMarkup() + ' ' + escapeHtml(rawCommand));

        if (resolvedCommand === 'clear') {
            resetTerminal();
            return;
        }

        if (resolvedCommand === 'sudo' || resolvedCommand.indexOf('sudo ') === 0) {
            appendTerminalResponse([
                'Permission denied. This incident is going to be reported to the administrator.'
            ], 'secret');
            return;
        }

        if (resolvedCommand === 'whoami') {
            appendTerminalResponse(getWhoAmIResponse());
            return;
        }

        if (resolvedCommand === 'su' || resolvedCommand.indexOf('su ') === 0) {
            handleUserSwitchCommand(resolvedCommand);
            return;
        }

        if (resolvedCommand === 'cd' || resolvedCommand.indexOf('cd ') === 0 || resolvedCommand.indexOf('open ') === 0) {
            if (!handleNavigationCommand(resolvedCommand)) {
                appendTerminalResponse([
                    'Unknown destination. Try <span class="terminal-highlight">cd about</span> or <span class="terminal-highlight">cd contact</span>.'
                ], 'system');
            }
            return;
        }

        if (terminalResponses[resolvedCommand]) {
            appendTerminalResponse(terminalResponses[resolvedCommand]);
            return;
        }

        appendTerminalResponse([
            'Unknown command: <span class="terminal-highlight">' + escapeHtml(normalized) + '</span>.',
            'Type <span class="terminal-highlight">help</span> to see the supported commands.'
        ], 'system');
    }

    function buildTimeline() {
        $('#experience-timeline').each(function() {
            var $timeline = $(this);
            var $userContent;

            if ($timeline.find('.vtimeline-point').length) {
                return;
            }

            $userContent = $timeline.children('div');

            $userContent.each(function() {
                $(this)
                    .addClass('vtimeline-content')
                    .wrap('<div class="vtimeline-point"><div class="vtimeline-block"></div></div>');
            });

            $timeline.find('.vtimeline-point').each(function() {
                $(this).prepend('<div class="vtimeline-icon"><i class="fa fa-map-marker"></i></div>');
            });

            $timeline.find('.vtimeline-content').each(function() {
                var date = $(this).data('date');

                if (date) {
                    $(this).parent().prepend('<span class="vtimeline-date">' + date + '</span>');
                }
            });
        });
    }

    $('#current-year').text(new Date().getFullYear());
    $html.removeClass('no-js');
    buildTimeline();
    syncTerminalPrompt();
    syncTerminalDockControls();
    syncTerminalDockLayout();

    $('a[href^="#"]').on('click', function(event) {
        var target = $(this).attr('href');

        if (!target || target === '#' || $(this).hasClass('no-scroll')) {
            return;
        }

        if (!$(target).length) {
            return;
        }

        event.preventDefault();
        scrollToTarget(target);
        closeMobileMenu();
    });

    $('#to-top').on('click', function() {
        scrollToTarget('top');
    });

    $('#lead-down button').on('click', function() {
        scrollToTarget('#about');
    });

    $mobileMenuOpen.on('click', function() {
        openMobileMenu();
    });

    $mobileMenuClose.on('click', function() {
        closeMobileMenu();
    });

    $(document).on('keydown', function(event) {
        if (event.key === 'Escape') {
            if (isTerminalExpanded()) {
                collapseDockedTerminal();
                return;
            }

            closeMobileMenu();
        }
    });

    $(window).on('resize', function() {
        syncTerminalDockLayout();
    });

    $terminalForm.on('submit', function(event) {
        var rawCommand = $terminalInput.val();

        event.preventDefault();

        if (!$.trim(rawCommand)) {
            return;
        }

        commandHistory.push(rawCommand);
        historyIndex = commandHistory.length;
        handleTerminalCommand(rawCommand);
        $terminalInput.val('');
    });

    $terminalInput.on('keydown', function(event) {
        if (!commandHistory.length) {
            return;
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault();
            historyIndex = Math.max(historyIndex - 1, 0);
            $terminalInput.val(commandHistory[historyIndex]);
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            historyIndex = Math.min(historyIndex + 1, commandHistory.length);

            if (historyIndex === commandHistory.length) {
                $terminalInput.val('');
                return;
            }

            $terminalInput.val(commandHistory[historyIndex]);
        }
    });

    $terminalDockToggle.on('click', function() {
        if (isTerminalExpanded()) {
            collapseDockedTerminal();
            return;
        }

        expandDockedTerminal();
    });

    $terminalReturnHome.on('click', function() {
        returnTerminalHome();
    });

    $heroTerminal.on('click', function(event) {
        if ($(event.target).closest('a, button, input, summary').length) {
            return;
        }

        if (isTerminalDocked() && !isTerminalExpanded()) {
            expandDockedTerminal();
            return;
        }

        maybeFocusTerminal();
    });

    maybeFocusTerminal();

})(jQuery);
