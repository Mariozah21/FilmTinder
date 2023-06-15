
import { createRouter, createWebHistory } from 'vue-router'
import Feed from '@/router/pages/Feed.vue'
import RegisterVue from '@/router/pages/Register.vue'
import Home from '@/router/pages/Home.vue'
import Login from '@/router/pages/Login.vue'
import Account from '@/router/pages/Account.vue'
import LikedFilms from '@/router/pages/LikedFilms.vue';
import SearchFilms from '@/router/pages/SearchFilms.vue';
import FriendsList from '@/router/pages/FriendsList.vue'
import { onAuthStateChanged, getAuth} from 'firebase/auth'
import firebaseConfig from '@/config'
import firebaseApp from '@/config'
import FriendsListVue from './pages/FriendsList.vue'



const auth = getAuth(firebaseApp);



const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/register',
      name: 'Register',
      component: RegisterVue
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/feed/:friendName?',
      name: 'Feed',
      component: Feed,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/account',
      name: 'Account',
      component: Account,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/searchfilms',
      name: 'SearchFilms',
      component: SearchFilms,
      meta: {
        requiresAuth: true
      }
    },{
      path: '/friendsList',
      name: 'FriendsList',
      component: FriendsList,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/likedfilms/:friendName?',
      name: 'LikedFilms',
      component: LikedFilms,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/'
    }

  ]
})

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(auth, user => {
      removeListener();
      resolve(user);
    })
  })
}

router.beforeEach(async(to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if(await getCurrentUser()){
      next();
    } else {
      alert('You are not authorized to access this area.');
      next({name : 'Home'});
    }
  }else{
    next();
  }
});
export default router