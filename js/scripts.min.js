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
    var githubUrl = 'https://github.com/kibk';
    var linkedinUrl = 'https://linkedin.com/in/mrkirillbykov/';
    var secretUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    var shellHost = 'kibk.net';
    var defaultShellUser = 'user';
    var ownerShellUsers = {
        kibk: true,
        root: true
    };
    var sectionOrder = ['about', 'experience', 'education', 'projects', 'skills', 'contact'];
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
    var openTargets = {
        github: {
            label: 'GitHub',
            url: githubUrl
        },
        linkedin: {
            label: 'LinkedIn',
            url: linkedinUrl
        },
        cv: {
            label: 'CV',
            url: cvUrl
        },
        resume: {
            label: 'CV',
            url: cvUrl
        },
        secret: {
            label: 'secret',
            url: secretUrl,
            ownerOnly: true
        }
    };
    var terminalDocuments = {
        about: [
            'Started in digital design and verification before getting pulled into continuous development and tooling.',
            'Today at Arm I work on using AI to make hardware design work simpler.',
            'This site pulls together the hardware, infrastructure, and tooling parts of that work.'
        ],
        experience: [
            'Arm: promoted to Staff Engineer in April 2026 after serving as Senior Engineer.',
            'Nordic Semiconductor: moved from digital design and verification into DevOps and design enablement.',
            'Most of the work has revolved around making hardware teams faster and easier to support.'
        ],
        education: [
            'Master studies focused on embedded computing systems, SystemC/TLM, and verification.',
            'Coursework spanned FPGA, digital systems, cryptography, and computer architecture.',
            'The education section below has the structured timeline.'
        ],
        projects: [
            'Homelab: self-hosted infrastructure and experiments.',
            'Custom keyboard work: soldering and nRF52-based builds.',
            'High-level verification environment: hybrid RTL/SystemC validation with faster iteration.'
        ],
        skills: [
            'Software: C++, Python, Shell, Git, Embedded C.',
            'GenAI: Prompt Engineering, GenAI System Architecture, GenAI Evaluation, GenAI Agents.',
            'Infrastructure: Docker, Azure, CI/CD.',
            'Hardware: FPGA, Verilog, SystemVerilog, SVA, SystemC, Verilator.'
        ],
        contact: [
            'Best route: the contact form below.',
            'Direct links are available through <span class="terminal-highlight">open github</span>, <span class="terminal-highlight">open linkedin</span>, and <span class="terminal-highlight">open cv</span>.'
        ],
        secret: [
            'Owner note unlocked.',
            'This terminal is deliberately simple on the surface and a little deeper underneath.',
            'If you found this, the shell is behaving exactly as intended.'
        ]
    };

    var terminalResponses = {
        help: [
            'Commands:',
            '<span class="terminal-highlight">ls</span>, <span class="terminal-highlight">pwd</span>, <span class="terminal-highlight">clear</span>, <span class="terminal-highlight">cd &lt;section&gt;</span>, <span class="terminal-highlight">cat &lt;section&gt;</span>, and <span class="terminal-highlight">open &lt;link&gt;/&lt;file&gt;</span> extend the shell.',
            'Use <span class="terminal-highlight">ls</span> to see available sections, then <span class="terminal-highlight">cat about</span> to read or <span class="terminal-highlight">cd projects</span> to jump.'
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
    var $terminalCloseToggle = $('#terminal-close-toggle');
    var $terminalMinToggle = $('#terminal-min-toggle');
    var $terminalOpenToggle = $('#terminal-open-toggle');
    var initialTerminalHtml = $terminalOutput.html();
    var commandHistory = [];
    var historyIndex = 0;
    var currentShellUser = defaultShellUser;
    var currentDirectory = 'home';
    var dockHintShown = false;

    function escapeHtml(value) {
        return $('<div>').text(value).html();
    }

    function isOwnerShellUser() {
        return !!ownerShellUsers[currentShellUser];
    }

    function getShellPathText() {
        if (currentDirectory === 'home') {
            return '~';
        }

        return '~/' + currentDirectory;
    }

    function getShellPromptText() {
        return currentShellUser + '@' + shellHost + ':' + getShellPathText() + '$';
    }

    function getShellPromptMarkup() {
        return '<span class="terminal-highlight">' + escapeHtml(getShellPromptText()) + '</span>';
    }

    function syncTerminalPrompt() {
        if ($terminalPrompt.length) {
            $terminalPrompt.text(getShellPromptText());
        }
    }

    function setCurrentDirectory(nextDirectory) {
        currentDirectory = nextDirectory || 'home';
        syncTerminalPrompt();
    }

    function getLsResponse() {
        var directories = [];
        var links = ['cv', 'github', 'linkedin'];

        if (currentDirectory !== 'home') {
            directories.push('<span class="terminal-highlight">../</span>');
        }

        $.each(sectionOrder, function(_, entry) {
            directories.push('<span class="terminal-highlight">' + escapeHtml(entry) + '/</span>');
        });

        if (isOwnerShellUser()) {
            links.push('<span class="terminal-highlight">secret</span>');
        }

        return [
            directories.join('  '),
            links.join('  ')
        ];
    }

    function getPwdResponse() {
        return [getShellPathText()];
    }

    function getCommandCompletionCandidates() {
        return [
            'help',
            'ls',
            'pwd',
            'cd',
            'cat',
            'open',
            'clear',
            'cv',
            'whoami',
            'coffee',
            'su'
        ];
    }

    function getArgumentCompletionCandidates(command) {
        if (command === 'cd') {
            return sectionOrder.concat(['home', '..', '~', '/']);
        }

        if (command === 'cat') {
            var targets = sectionOrder.slice();

            if (isOwnerShellUser()) {
                targets.push('secret');
            }

            return targets;
        }

        if (command === 'open') {
            var openEntries = ['github', 'linkedin', 'cv'];

            if (isOwnerShellUser()) {
                openEntries.push('secret');
            }

            return openEntries;
        }

        if (command === 'su') {
            return [defaultShellUser, 'kibk', 'root'];
        }

        return [];
    }

    function getLongestCommonPrefix(options) {
        var prefix;
        var index = 0;

        if (!options.length) {
            return '';
        }

        prefix = options[0];

        while (index < prefix.length) {
            var character = prefix.charAt(index);
            var matches = $.grep(options, function(option) {
                return option.charAt(index) === character;
            }).length === options.length;

            if (!matches) {
                break;
            }

            index += 1;
        }

        return prefix.slice(0, index);
    }

    function applyTabCompletion() {
        var rawValue = $terminalInput.val();
        var trimmedStart = rawValue.replace(/^\s+/, '');
        var hasTrailingSpace = /\s$/.test(rawValue);
        var parts = trimmedStart ? trimmedStart.split(/\s+/) : [];
        var fragment;
        var command;
        var options;
        var prefix;

        if (!parts.length) {
            return;
        }

        if (parts.length === 1 && !hasTrailingSpace) {
            fragment = parts[0].toLowerCase();
            options = $.grep(getCommandCompletionCandidates(), function(candidate) {
                return candidate.indexOf(fragment) === 0;
            });

            if (!options.length) {
                return;
            }

            prefix = getLongestCommonPrefix(options);

            if (!prefix) {
                return;
            }

            if (options.length === 1) {
                $terminalInput.val(options[0] + ' ');
                return;
            }

            if (prefix === fragment) {
                return;
            }

            $terminalInput.val(prefix);
            return;
        }

        command = terminalAliases[parts[0].toLowerCase()] || parts[0].toLowerCase();
        fragment = hasTrailingSpace ? '' : parts[parts.length - 1].toLowerCase();
        options = $.grep(getArgumentCompletionCandidates(command), function(candidate) {
            return candidate.indexOf(fragment) === 0;
        });

        if (!options.length) {
            return;
        }

        prefix = getLongestCommonPrefix(options);

        if (!prefix) {
            return;
        }

        if (hasTrailingSpace) {
            parts.push(prefix);
        } else {
            parts[parts.length - 1] = prefix;
        }

        if (options.length === 1) {
            $terminalInput.val(parts.join(' ') + ' ');
            return;
        }

        $terminalInput.val(parts.join(' '));
    }

    function getWhoAmIResponse() {
        if (isOwnerShellUser()) {
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

    function setTerminalLightState($control, enabled, label) {
        if (!$control.length) {
            return;
        }

        $control.prop('disabled', !enabled);
        $control.attr('aria-disabled', enabled ? 'false' : 'true');
        $control.toggleClass('is-active', enabled);

        if (label) {
            $control.attr('aria-label', label);
        }
    }

    function syncTerminalDockControls() {
        setTerminalLightState($terminalCloseToggle, isTerminalDocked(), 'Return terminal to intro');
        setTerminalLightState($terminalMinToggle, isTerminalDocked() && isTerminalExpanded(), 'Minimize terminal');
        setTerminalLightState($terminalOpenToggle, isTerminalDocked() && !isTerminalExpanded(), 'Open terminal');
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
                'Terminal docked. Select it or press the <span class="terminal-highlight">green</span> button to keep typing.',
                'Use <span class="terminal-highlight">cd home</span> or the <span class="terminal-highlight">red</span> button to bring it back to the intro.'
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
        setCurrentDirectory('home');
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

        if (isOwnerShellUser()) {
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

    function handleListCommand() {
        appendTerminalResponse(getLsResponse());
        return true;
    }

    function handlePrintWorkingDirectoryCommand() {
        appendTerminalResponse(getPwdResponse());
        return true;
    }

    function handleCatCommand(command) {
        var target = $.trim(command.slice(3));
        var documentKey = target.toLowerCase();

        if (!target) {
            appendTerminalResponse([
                'Specify a document, for example <span class="terminal-highlight">cat about</span>.'
            ], 'system');
            return true;
        }

        if (documentKey === 'secret' && !isOwnerShellUser()) {
            appendTerminalResponse([
                'cat: <span class="terminal-highlight">' + escapeHtml(target) + '</span>: No such file.'
            ], 'system');
            return true;
        }

        if (terminalDocuments[documentKey]) {
            appendTerminalResponse(terminalDocuments[documentKey]);
            return true;
        }

        if (openTargets[documentKey]) {
            appendTerminalResponse([
                'Use <span class="terminal-highlight">open ' + escapeHtml(documentKey) + '</span> for that target.'
            ], 'system');
            return true;
        }

        appendTerminalResponse([
            'cat: <span class="terminal-highlight">' + escapeHtml(target) + '</span>: No such file.'
        ], 'system');
        return true;
    }

    function handleOpenCommand(command) {
        var target = $.trim(command.slice(4));
        var openTarget;

        if (!target) {
            appendTerminalResponse([
                'Specify a target, for example <span class="terminal-highlight">open github</span>.'
            ], 'system');
            return true;
        }

        openTarget = openTargets[target];

        if (!openTarget || (openTarget.ownerOnly && !isOwnerShellUser())) {
            appendTerminalResponse([
                'Unknown open target. Try <span class="terminal-highlight">open github</span>, <span class="terminal-highlight">open linkedin</span>, or <span class="terminal-highlight">open cv</span>.'
            ], 'system');
            return true;
        }

        window.open(openTarget.url, '_blank', 'noopener');
        appendTerminalResponse([
            'Opening <span class="terminal-highlight">' + escapeHtml(openTarget.label) + '</span> in a new tab.'
        ], 'system');
        return true;
    }

    function handleNavigationCommand(command) {
        var parts = command.split(' ');
        var destination = parts.slice(1).join(' ');

        if (!destination) {
            appendTerminalResponse([
                'Specify a destination, for example <span class="terminal-highlight">cd projects</span>.'
            ], 'system');
            return true;
        }

        if (destination === '..' || destination === '~' || destination === '/') {
            destination = 'home';
        } else if (destination.charAt(0) === '/') {
            destination = destination.slice(1);
        }

        if (destination === 'top') {
            destination = 'home';
        }

        if (sectionTargets[destination]) {
            setCurrentDirectory(destination === 'top' ? 'home' : destination);
            appendTerminalResponse([
                'Changed directory to <span class="terminal-highlight">' + escapeHtml(destination) + '</span>.'
            ], 'system');

            if (destination === 'home') {
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

        if (resolvedCommand === 'ls') {
            handleListCommand();
            return;
        }

        if (resolvedCommand === 'pwd') {
            handlePrintWorkingDirectoryCommand();
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

        if (resolvedCommand === 'cat' || resolvedCommand.indexOf('cat ') === 0) {
            handleCatCommand(resolvedCommand);
            return;
        }

        if (resolvedCommand === 'open' || resolvedCommand.indexOf('open ') === 0) {
            handleOpenCommand(resolvedCommand);
            return;
        }

        if (resolvedCommand === 'cd' || resolvedCommand.indexOf('cd ') === 0) {
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
        if (event.key === 'Tab') {
            event.preventDefault();
            applyTabCompletion();
            return;
        }

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

    $terminalOpenToggle.on('click', function() {
        if (!isTerminalDocked() || isTerminalExpanded()) {
            return;
        }

        expandDockedTerminal();
    });

    $terminalMinToggle.on('click', function() {
        if (!isTerminalExpanded()) {
            return;
        }

        collapseDockedTerminal();
    });

    $terminalCloseToggle.on('click', function() {
        if (!isTerminalDocked()) {
            return;
        }

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
