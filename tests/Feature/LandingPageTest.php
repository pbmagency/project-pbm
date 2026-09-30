<?php

test('the landing page loads successfully', function () {
    $this->get('/')
        ->assertOk()
        ->assertSee('project');
});

test('the checkout placeholder page loads successfully', function () {
    $this->get('/checkout')->assertOk();
});
