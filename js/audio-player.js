/**
 * Custom Audio Player
 * Handles play/pause, progress tracking, and single-track playback.
 * Since no real audio files are present, this simulates playback visually.
 */
(function () {
    'use strict';

    let activePlayer = null;

    // Simulated track durations (seconds)
    const trackDurations = {
        'track-01': 187,
        'track-02': 224,
        'track-03': 196,
        'track-04': 210,
        'track-05': 265,
        'track-06': 198
    };

    function formatTime(seconds) {
        var mins = Math.floor(seconds / 60);
        var secs = Math.floor(seconds % 60);
        return mins + ':' + (secs < 10 ? '0' : '') + secs;
    }

    function AudioPlayer(container) {
        this.container = container;
        this.playBtn = container.querySelector('.player-play');
        this.progressFill = container.querySelector('.player-progress-fill');
        this.progressBar = container.querySelector('.player-progress');
        this.timeDisplay = container.querySelector('.player-time');
        this.trackId = container.dataset.track;
        this.duration = trackDurations[this.trackId] || 180;
        this.currentTime = 0;
        this.isPlaying = false;
        this.intervalId = null;

        this.timeDisplay.textContent = formatTime(this.duration);
        this.bindEvents();
    }

    AudioPlayer.prototype.bindEvents = function () {
        var self = this;

        this.playBtn.addEventListener('click', function () {
            self.toggle();
        });

        this.progressBar.addEventListener('click', function (e) {
            var rect = self.progressBar.getBoundingClientRect();
            var ratio = (e.clientX - rect.left) / rect.width;
            ratio = Math.max(0, Math.min(1, ratio));
            self.currentTime = ratio * self.duration;
            self.updateProgress();
        });
    };

    AudioPlayer.prototype.toggle = function () {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    };

    AudioPlayer.prototype.play = function () {
        // Pause any other active player
        if (activePlayer && activePlayer !== this) {
            activePlayer.pause();
        }

        this.isPlaying = true;
        activePlayer = this;
        this.playBtn.classList.add('playing');
        this.container.classList.add('playing');

        var self = this;
        this.intervalId = setInterval(function () {
            self.currentTime += 0.1;
            if (self.currentTime >= self.duration) {
                self.currentTime = 0;
                self.pause();
                return;
            }
            self.updateProgress();
        }, 100);
    };

    AudioPlayer.prototype.pause = function () {
        this.isPlaying = false;
        this.playBtn.classList.remove('playing');
        this.container.classList.remove('playing');

        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        if (activePlayer === this) {
            activePlayer = null;
        }
    };

    AudioPlayer.prototype.updateProgress = function () {
        var ratio = this.currentTime / this.duration;
        this.progressFill.style.width = (ratio * 100) + '%';

        var remaining = this.duration - this.currentTime;
        this.timeDisplay.textContent = formatTime(remaining);
    };

    // Initialize all players
    document.addEventListener('DOMContentLoaded', function () {
        var players = document.querySelectorAll('.audio-player');
        players.forEach(function (el) {
            new AudioPlayer(el);
        });
    });
})();
