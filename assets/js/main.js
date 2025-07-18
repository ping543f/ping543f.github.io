jQuery(document).ready(function($) {
    
    // Dark Mode Toggle
    const darkModeToggle = $('#darkModeToggle');
    const body = $('body');
    
    // Check for saved theme preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        body.addClass('dark-mode');
        darkModeToggle.find('i').removeClass('fa-moon-o').addClass('fa-sun-o');
    }
    
    darkModeToggle.click(function() {
        body.toggleClass('dark-mode');
        
        if (body.hasClass('dark-mode')) {
            $(this).find('i').removeClass('fa-moon-o').addClass('fa-sun-o');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            $(this).find('i').removeClass('fa-sun-o').addClass('fa-moon-o');
            localStorage.setItem('darkMode', 'disabled');
        }
    });
    
    // Smooth Scrolling
    $('a[href^="#"]').click(function(e) {
        e.preventDefault();
        const target = $(this.getAttribute('href'));
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 100
            }, 800);
        }
    });
    
    // Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    $('.section').each(function() {
        observer.observe(this);
    });
    
    // Publications Search and Filter
    const searchInput = $('#publicationSearch');
    const filterButtons = $('.filter-btn');
    const publicationCards = $('.publication-card');
    
    searchInput.on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        filterPublications(searchTerm, getActiveFilter());
    });
    
    filterButtons.click(function() {
        filterButtons.removeClass('active');
        $(this).addClass('active');
        const year = $(this).data('year');
        filterPublications(searchInput.val().toLowerCase(), year);
    });
    
    function getActiveFilter() {
        return $('.filter-btn.active').data('year');
    }
    
    function filterPublications(searchTerm, year) {
        publicationCards.each(function() {
            const card = $(this);
            const title = card.find('.publication-title').text().toLowerCase();
            const journal = card.find('.journal-name').text().toLowerCase();
            const cardYear = card.data('year').toString();
            
            const matchesSearch = title.includes(searchTerm) || journal.includes(searchTerm);
            const matchesYear = year === 'all' || cardYear === year;
            
            if (matchesSearch && matchesYear) {
                card.show();
            } else {
                card.hide();
            }
        });
    }
    
    // Mobile Navigation
    $('.mobile-nav-toggle').click(function() {
        $('.nav-links').toggleClass('active');
        $(this).toggleClass('active');
    });
    
    // Animated Counter for Stats
    function animateCounter() {
        $('.stat-number').each(function() {
            const $this = $(this);
            const target = parseInt($this.text().replace('+', ''));
            
            $({ counter: 0 }).animate({ counter: target }, {
                duration: 2000,
                easing: 'swing',
                step: function() {
                    $this.text(Math.ceil(this.counter) + '+');
                },
                complete: function() {
                    $this.text(target + '+');
                }
            });
        });
    }
    
    // Trigger counter animation when about section is visible
    const aboutSection = $('#about');
    if (aboutSection.length) {
        const aboutObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter();
                    aboutObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        aboutObserver.observe(aboutSection[0]);
    }

    // Sticky Navigation
    const mainNav = $('.main-nav');
    const navOffset = mainNav.offset().top;
    
    $(window).scroll(function() {
        const scrollTop = $(this).scrollTop();
        
        if (scrollTop > navOffset) {
            mainNav.addClass('sticky');
        } else {
            mainNav.removeClass('sticky');
        }
        
        // Scroll to top button
        if (scrollTop > 500) {
            scrollToTopBtn.addClass('visible');
        } else {
            scrollToTopBtn.removeClass('visible');
        }
    });
    
    // Scroll to Top Button
    const scrollToTopBtn = $('#scrollToTop');
    
    scrollToTopBtn.click(function() {
        $('html, body').animate({ scrollTop: 0 }, 600);
    });
    
    // Contact Form Handling
    $('#contactForm').submit(function(e) {
        e.preventDefault();
        
        // Simple form validation and feedback
        const name = $('#name').val();
        const email = $('#email').val();
        const subject = $('#subject').val();
        const message = $('#message').val();
        
        if (name && email && subject && message) {
            // Here you would typically send the form data to a server
            alert('Thank you for your message! I will get back to you soon.');
            this.reset();
        } else {
            alert('Please fill in all fields.');
        }
    });
    
    // Intersection Observer for fade-in animations
    const fadeInElements = document.querySelectorAll('.section, .project-card, .publication-card');
    
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    fadeInElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
        fadeInObserver.observe(element);
    });

    /*======= Skillset *=======*/
    
    $('.level-bar-inner').css('width', '0');
    
    $(window).on('load', function() {

        $('.level-bar-inner').each(function() {
        
            var itemWidth = $(this).data('level');
            
            $(this).animate({
                width: itemWidth
            }, 800);
            
        });

    });
    
    /* Bootstrap Tooltip for Skillset */
    $('.level-label').tooltip();
    
    /* jQuery RSS - https://github.com/sdepold/jquery-rss */
    $("#rss-feeds").rss(
    
        //Change this to your own rss feeds
        "http://feeds.feedburner.com/TechCrunch/startups",
        
        {
        // how many entries do you want?
        // default: 4
        // valid values: any integer
        limit: 3,
        
        // the effect, which is used to let the entries appear
        // default: 'show'
        // valid values: 'show', 'slide', 'slideFast', 'slideSynced', 'slideFastSynced'
        effect: 'slideFastSynced',
        
        // outer template for the html transformation
        // default: "<ul>{entries}</ul>"
        // valid values: any string
        layoutTemplate: "<div class='item'>{entries}</div>",
        
        // inner template for each entry
        // default: '<li><a href="{url}">[{author}@{date}] {title}</a><br/>{shortBodyPlain}</li>'
        // valid values: any string
        entryTemplate: '<h3 class="title"><a href="{url}" target="_blank">{title}</a></h3><div><p>{shortBodyPlain}</p><a class="more-link" href="{url}" target="_blank"><i class="fa fa-external-link"></i>Read more</a></div>'
        
        }
    );
    
});
        
        }
    );
    
    /* Github Activity Feed - https://github.com/caseyscarborough/github-activity */
    GitHubActivity.feed({ username: "caseyscarborough", selector: "#ghfeed" });


});