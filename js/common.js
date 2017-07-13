'use strict';

let data = '';

class Storage {

  get() {
    return localStorage.getItem('todo');
  }

  set(data) {
    localStorage.setItem('todo', JSON.stringify(data));
  }

}

class Todo extends Storage {

  constructor(template, target) {
    super();
    this.template = template;
    this.target = target;
  }

  init() {
    if (this.get() !== null) {
      this.data = JSON.parse(this.get());
    } else {
      this.data = {
        "name": "task",
        "items": []
      };
    }
  }

  add(text) {
    this.data.items.push({
      "name": text,
      "status": ""
    });
    this.render();
  }

  edit(itemIndex, text) {
    this.data.items[itemIndex].name = text;
    this.render();
  }

  del(itemIndex) {
    this.data.items.splice(itemIndex, 1);
    this.render();
  }

  set_status(itemIndex, status) {
    this.data.items[itemIndex].status = status;
    this.render();
  }

  up(itemIndex) {
    if (itemIndex !== 0) {
      let item = this.data.items[itemIndex - 1];
      this.data.items[itemIndex - 1] = this.data.items[itemIndex];
      this.data.items[itemIndex] = item;
      this.render();
    }
  }

  down(itemIndex) {
    if (itemIndex !== Object.keys(this.data.items).length - 1) {
      let item = this.data.items[itemIndex * 1 + 1];
      this.data.items[itemIndex * 1 + 1] = this.data.items[itemIndex];
      this.data.items[itemIndex] = item;
      this.render();
    }
  }

  render() {
    if (TrimPath !== 'undefined') {
      this.set(this.data);
      return $('#' + this.target).html(TrimPath.parseDOMTemplate(this.template).process(this.data));
    }
  }

}

$(function () {
  // create todo list
  let todo = new Todo('todo-template', 'todo-group');
  todo.init();
  todo.render();

  // add task
  $('#add-task').on('click', function () {
    let input = $('#input-text');

    todo.add(input.val());
    input.val('');
  });

  // modify task status
  $(document).on('click', '.modify-task', function () {
    todo.set_status($(this).attr('data-id'), $(this).attr('data-status'));
  });

  // edit task
  $(document).on('click', '.edit-task', function () {
    let itemIndex = $(this).attr('data-id');
    let parent = $(this).parent().parent();
    let span = parent.find('.text-task');

    let input_group = $(`<div class="input-group input-group-sm" style="margin: 0 10px;">
      <span class="input-group-addon">${itemIndex * 1 + 1}</span>
      <input type="text" class="form-control" data-id="${itemIndex}" placeholder="Edit your task..." value="${span.text()}">
      <span class="input-group-btn"><button id="commit-task" class="btn btn-default" type="button">
      <span class="glyphicon glyphicon-ok"></span></button></span></div>`);

    // commit changes task text
    input_group.on('click', '#commit-task', function () {
      let input = $(this).closest('div').find('input');

      todo.edit(input.attr('data-id'), input.val());
    });

    parent.parent().html(input_group);
  });

  // delete task
  $(document).on('click', '.delete-task', function () {
    if (confirm('Are you sure?')) {
      todo.del($(this).attr('data-id'));
    }
  });

  // up task
  $(document).on('click', '.up-task', function () {
    todo.up($(this).attr('data-id'));
  });

  // down task
  $(document).on('click', '.down-task', function () {
    todo.down($(this).attr('data-id'));
  });
});