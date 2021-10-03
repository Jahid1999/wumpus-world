$(document).ready(function () {
    updateWorldSize();
});

$(document).keydown(function (e) {
    console.log(e);
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.view.event.preventDefault();
    }
})

$(document).on('input', '#world-size-slider', function () {
    updateWorldSize();
});

$(document).on('mouseup', 'input[type=\'range\']', function () {
    $(this).blur();
});  

$(document).on('mouseup', 'input[type=\'checkbox\']', function () {
    $(this).blur();
});  

$(document).on('input', '#volume-slider', updateVolume);

$(document).on('input', '#world-auto-increment', function () {
    worldAutoIncrement = $('#world-auto-increment').is(':checked');
});

$(document).on('input', '#cheat-mode', function () {
    cheatMode = $('#cheat-mode').is(':checked');
    cheat();
});

function updateVolume() {
    var volumePercent = $('#volume-slider').val();
    var volume = volumePercent / 100
    $('.volume-value').html(`${volumePercent}%`);
    masterVolume(volume);
}

function updateWorldSize() {
    roomsPerRow = $('#world-size-slider').val();
    $('.world-size-value').html(`${roomsPerRow}x${roomsPerRow}`);
    restart();
}

function setWorldSize(value) {
    $('#world-size-slider').val(value);
    roomsPerRow = value;
    $('.world-size-value').html(`${value}x${value}`);
}
