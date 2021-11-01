
const Main = {

  tasks: [],

  init: function() {
    this.cacheSelectors()
    this.bindEvents()
    this.getStoraged()
    this.buildTasks()
  },

  cacheSelectors: function() {
    this.$checkButtons = document.querySelectorAll('.check')
    this.$inputTask = document.querySelector('#inputTask')
    this.$list = document.querySelector('#list')
    this.$removeButtons = document.querySelectorAll('.remove')
  },

  bindEvents: function() {
    const self = this

    this.$checkButtons.forEach(function(button){
      button.onclick = self.Events.checkButton_click.bind(self)
    })

    this.$inputTask.onkeypress = self.Events.inputTask_keypress.bind(this)

    this.$removeButtons.forEach(function(button){
      button.onclick = self.Events.removeButton_click.bind(self)
    })
  },

  getStoraged: function() {
    const taskStoraged = localStorage.getItem('taskStorage')

    if (taskStoraged) {
      return this.tasks = JSON.parse(taskStoraged)
    }localStorage.setItem('taskStorage', JSON.stringify([]))
  },

  getTaskHtml: function(value, isDone) {
    return `
      <li class="${isDone ? 'done':''}" data-task = '${value}'>          
        <div class="check"></div>
        <label class="task">
          ${value}
        </label>
        <button class="remove"></button>
     </li>
    `
  },
  insertHtml: function(element, htmlString) {
    element.innerHTML += htmlString
    
    this.cacheSelectors()
    this.bindEvents()
  },

  buildTasks: function() {
    let html = ''

    this.tasks.forEach(item => html += this.getTaskHtml(item.task, item.done))
    this.insertHtml(this.$list, html)
  },



  Events: {
    checkButton_click: function(e) {
      const li = e.target.parentElement
      const value = li.dataset.task
      const isDone = li.classList.contains('done')

      const newTaskState = this.tasks.map( item => {
        if(item.task === value){
          item.done = !isDone
        }
        return item
      })

      localStorage.setItem('taskStorage', JSON.stringify(newTaskState))
      
      if (!isDone) {
        return li.classList.add('done')       
      }

      li.classList.remove('done')
    },

    inputTask_keypress: function(e){      
      const key = e.key
      const value = e.target.value
      const isDone = false

      let html = ''
      if (key === 'Enter') {

        html = this.getTaskHtml(value, isDone)

        this.insertHtml(this.$list, html)

        e.target.value = ''

        this.cacheSelectors()
        this.bindEvents()

        const storagedTasks = localStorage.getItem('taskStorage')
        const storagedTasksObj = JSON.parse(storagedTasks)

        const arrayTasks = [
          {task : value, done : isDone},
          ... storagedTasksObj
        ]

        this.tasks = arrayTasks
        localStorage.setItem('taskStorage',JSON.stringify(arrayTasks))
        console.log(this.tasks)

      }
    },

    removeButton_click: function(e){
      const li = e.target.parentElement
      const value = li.dataset.task

      const newTasState = this.tasks.filter( item => item.task !== value)

      localStorage.setItem('taskStorage', JSON.stringify(newTasState))


      li.classList.add('removed')

      setTimeout(function(){
        li.classList.add('hidden')
      },300)
    }
  }

}

Main.init()

