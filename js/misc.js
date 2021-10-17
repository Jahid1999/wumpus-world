$(document).ready(function () {
    updateWorldSize();
    updatePitPercentage();
    updateGoldNumber();
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

$(document).on('input', '#pit-number-slider', function () {
    updatePitPercentage();
});

$(document).on('input', '#gold-number-slider', function () {
    updateGoldNumber();
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

function updatePitPercentage() {
    pitPercentage = $('#pit-number-slider').val();
    $('.pit-number-value').html(`${pitPercentage} %`);
    restart();
}

function updateGoldNumber() {
    totalGold = $('#gold-number-slider').val();
    $('.gold-number-value').html(`${totalGold}`);
    restart();
}
