import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

// Public views
import HomeView from '../views/public/HomeView.vue'
import CatalogView from '../views/public/CatalogView.vue'
import GuideView from '../views/public/GuideView.vue'
import AboutView from '../views/public/AboutView.vue'
import ContactView from '../views/public/ContactView.vue'

// Auth views
import LoginView from '../views/auth/LoginView.vue'
import RegisterView from '../views/auth/RegisterView.vue'

// Layouts
import MainLayout from '../layouts/MainLayout.vue'

// Admin/Librarian views
import DashboardView from '../views/dashboard/DashboardView.vue'
import BookListView from '../views/books/BookListView.vue'
import ImportBooksView from '../views/books/ImportBooksView.vue'
import BorrowListView from '../views/borrows/BorrowListView.vue'
import BorrowCreateView from '../views/borrows/BorrowCreateView.vue'
import ReaderListView from '../views/readers/ReaderListView.vue'
import FineListView from '../views/borrows/FineListView.vue'
import OverdueListView from '../views/borrows/OverdueListView.vue'

// Admin specific views
import AccountsView from '../views/admin/AccountsView.vue'
import ReportsView from '../views/admin/ReportsView.vue'
import SettingsView from '../views/admin/SettingsView.vue'

// Reader specific views
import MyBorrowHistoryView from '../views/reader/MyBorrowHistoryView.vue'
import MyLibraryCardView from '../views/reader/MyLibraryCardView.vue'
import MyFinesView from '../views/reader/MyFinesView.vue'
import ReaderBrowseView from '../views/reader/ReaderBrowseView.vue'
import GamificationView from '../views/reader/GamificationView.vue'

// Shared views
import AccountSettingsView from '../views/shared/AccountSettingsView.vue'
import HelpCenterView from '../views/shared/HelpCenterView.vue'

const routes = [
  {
    path: '/',
    component: HomeView
  },
  {
    path: '/catalog',
    component: CatalogView
  },
  {
    path: '/guide',
    component: GuideView
  },
  {
    path: '/about',
    component: AboutView
  },
  {
    path: '/contact',
    component: ContactView
  },
  {
    path: '/login',
    component: LoginView
  },
  {
    path: '/register',
    component: RegisterView
  },
  {
    path: '/app',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: to => {
          const auth = useAuthStore()
          if (['Admin', 'Librarian'].includes(auth.role)) {
            return '/app/dashboard'
          }
          return '/app/browse'
        }
      },

      // ─── Admin + Librarian ───
      {
        path: 'dashboard',
        component: DashboardView,
        meta: { roles: ['Admin', 'Librarian'] }
      },
      {
        path: 'books',
        component: BookListView,
        meta: { roles: ['Admin', 'Librarian', 'Reader'] }
      },
      {
        path: 'books/import',
        component: ImportBooksView,
        meta: { roles: ['Admin', 'Librarian'] }
      },
      {
        path: 'readers',
        component: ReaderListView,
        meta: { roles: ['Admin', 'Librarian'] }
      },
      {
        path: 'borrows',
        component: BorrowListView,
        meta: { roles: ['Admin', 'Librarian'] }
      },
      {
        path: 'borrow-create',
        component: BorrowCreateView,
        meta: { roles: ['Admin', 'Librarian'] }
      },
      {
        path: 'overdue',
        component: OverdueListView,
        meta: { roles: ['Admin', 'Librarian'] }
      },
      {
        path: 'fines',
        component: FineListView,
        meta: { roles: ['Admin', 'Librarian'] }
      },

      // ─── Admin Only ───
      {
        path: 'accounts',
        component: AccountsView,
        meta: { roles: ['Admin'] }
      },
      {
        path: 'reports',
        component: ReportsView,
        meta: { roles: ['Admin'] }
      },
      {
        path: 'settings',
        component: SettingsView,
        meta: { roles: ['Admin'] }
      },

      // ─── Reader Only ───
      {
        path: 'browse',
        component: ReaderBrowseView,
        meta: { roles: ['Reader'] }
      },
      {
        path: 'my-borrows',
        component: MyBorrowHistoryView,
        meta: { roles: ['Reader'] }
      },
      {
        path: 'my-card',
        component: MyLibraryCardView,
        meta: { roles: ['Reader'] }
      },
      {
        path: 'my-fines',
        component: MyFinesView,
        meta: { roles: ['Reader'] }
      },
      {
        path: 'gamification',
        component: GamificationView,
        meta: { roles: ['Reader'] }
      },

      // ─── Shared ───
      {
        path: 'account-settings',
        component: AccountSettingsView,
        meta: { roles: ['Admin', 'Librarian', 'Reader'] }
      },
      {
        path: 'profile',
        redirect: 'account-settings'
      },
      {
        path: 'help',
        component: HelpCenterView,
        meta: { roles: ['Admin', 'Librarian', 'Reader'] }
      }
    ]
  },

  // Fallbacks
  {
    path: '/dashboard',
    redirect: '/app/dashboard'
  },
  {
    path: '/books',
    redirect: '/app/books'
  },
  {
    path: '/readers',
    redirect: '/app/readers'
  },
  {
    path: '/borrows',
    redirect: '/app/borrows'
  },
  {
    path: '/borrow-create',
    redirect: '/app/borrow-create'
  },
  {
    path: '/overdue',
    redirect: '/app/overdue'
  },
  {
    path: '/fines',
    redirect: '/app/fines'
  },
  {
    path: '/my-borrows',
    redirect: '/app/my-borrows'
  },
  {
    path: '/my-card',
    redirect: '/app/my-card'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

function homeForRole(role) {
  if (['Admin', 'Librarian'].includes(role)) return '/app/dashboard'
  if (role === 'Reader') return '/app/browse'
  return '/'
}

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return '/login'
  }

  const matchedAuthRoute = to.matched.find(route => route.meta.requiresAuth)
  if (matchedAuthRoute && !auth.isLoggedIn) {
    return '/login'
  }

  if ((to.path === '/login' || to.path === '/register') && auth.isLoggedIn) {
    return homeForRole(auth.role)
  }

  if (to.meta.roles && !to.meta.roles.includes(auth.role)) {
    return homeForRole(auth.role)
  }
})

export default router