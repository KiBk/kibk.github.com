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
            '<span class="terminal-highlight">cv</span> opens the resume link. <span class="terminal-highlight">clear</span> resets the terminal.',
            'Use <span class="terminal-highlight">go projects</span> or <span class="terminal-highlight">go contact</span> to jump to a section.'
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
        whoami: [
            'Kirill Bykov',
            'Hardware / Software Engineer',
            'Focused on AI-assisted engineering workflows, embedded systems, and developer tooling.'
        ],
        hire: [
            'Easter egg unlocked.',
            'I like hard problems, clean systems, and keyboards that click.',
            'If that sounds useful, the contact form is waiting below.'
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
        whoami: 'whoami',
        hireme: 'hire',
        'hire-me': 'hire'
    };

    var $html = $('html');
    var $body = $('body');
    var $header = $('header');
    var $mobileMenuOpen = $('#mobile-menu-open');
    var $mobileMenuClose = $('#mobile-menu-close');
    var $terminalOutput = $('#terminal-output');
    var $terminalForm = $('#terminal-form');
    var $terminalInput = $('#terminal-input');
    var initialTerminalHtml = $terminalOutput.html();
    var commandHistory = [];
    var historyIndex = 0;

    function escapeHtml(value) {
        return $('<div>').text(value).html();
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
        $terminalOutput.scrollTop($terminalOutput[0].scrollHeight);
    }

    function normalizeCommand(command) {
        return $.trim(command).toLowerCase().replace(/\s+/g, ' ');
    }

    function maybeFocusTerminal() {
        if (!isCoarsePointer() && window.innerWidth > 900) {
            $terminalInput.trigger('focus');
        }
    }

    function handleNavigationCommand(command) {
        var parts = command.split(' ');
        var action = parts[0];
        var destination = parts.slice(1).join(' ');

        if (!destination) {
            appendTerminalResponse([
                'Specify a destination, for example <span class="terminal-highlight">go projects</span>.'
            ], 'system');
            return true;
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
                'Jumping to <span class="terminal-highlight">' + escapeHtml(destination) + '</span>.'
            ], 'system');
            scrollToTarget(sectionTargets[destination]);
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

        appendTerminalLine('command', '<span class="terminal-highlight">kirill@portfolio:~$</span> ' + escapeHtml(rawCommand));

        if (resolvedCommand === 'clear') {
            resetTerminal();
            return;
        }

        if (resolvedCommand === 'sudo' || resolvedCommand.indexOf('sudo ') === 0) {
            appendTerminalResponse([
                'Permission denied.',
                'Try <span class="terminal-highlight">help</span> or keep hunting for a better easter egg.'
            ], 'secret');
            return;
        }

        if (resolvedCommand.indexOf('go ') === 0 || resolvedCommand.indexOf('open ') === 0) {
            if (!handleNavigationCommand(resolvedCommand)) {
                appendTerminalResponse([
                    'Unknown destination. Try <span class="terminal-highlight">go about</span> or <span class="terminal-highlight">go contact</span>.'
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
            closeMobileMenu();
        }
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

    $('#hero-terminal').on('click', function(event) {
        if ($(event.target).is('a, button, input, summary')) {
            return;
        }

        maybeFocusTerminal();
    });

    maybeFocusTerminal();

})(jQuery);
