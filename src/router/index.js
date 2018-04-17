import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/Home'
import Dashboard from '@/pages/Dashboard'
import BasicTable from '@/pages/BasicTable'
import Booklist from '@/pages/Booklist'
import Widget from '@/pages/Widget'
import Panels from '@/pages/Panels'
import Editor from '@/pages/Editor'
import Books from '@/pages/Books'
import Charts from '@/pages/Charts'
import Login from '@/pages/Login'
import LockScreen from '@/pages/LockScreen'
import Loading from '@/pages/Loading'
import Notes from '@/pages/Notes'
import BookInfo from '@/pages/BookInfo'
import AddBook from '@/pages/AddBook'
import AddNote from '@/pages/AddNote'
import TimeManagement from '@/pages/TimeManagement'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Home,
      children: [
        {
          path: '/',
          name: 'Dashboard',
          component: Dashboard
        },
        {
          path: '/time',
          name: 'TimeManagement',
          component: TimeManagement
        },
        {
          path: '/bookInfo',
          name: 'BookInfo',
          component: BookInfo
        },
        {
          path: '/addNote',
          name: 'AddNote',
          component: AddNote
        },
        {
          path: '/addBook',
          name: 'AddBook',
          component: AddBook
        },
        {
          path: 'widget',
          name: 'Widget',
          component: Widget
        },
        {
          path: 'panels',
          name: 'Panels',
          component: Panels
        },
        {
          path: 'notes',
          name: 'Notes',
          component: Notes
        },
        {
          path: 'editor',
          name: 'Editor',
          component: Editor
        },
        {
          path: 'books',
          name: 'Books',
          component: Books
        },
        {
          path: 'basic-table',
          name: 'BasicTable',
          component: BasicTable
        },
        {
          path: 'booklist',
          name: 'Booklist',
          component: Booklist
        },
        {
          path: 'charts',
          name: 'Charts',
          component: Charts
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      components: {
        blank: Login
      }
    },
    {
      path: '/lockscreen',
      name: 'Lockscreen',
      components: {
        blank: LockScreen
      }
    },
    {
      path: '/loading',
      name: 'Loading',
      components: {
        blank: Loading
      }
    }
  ]
})
