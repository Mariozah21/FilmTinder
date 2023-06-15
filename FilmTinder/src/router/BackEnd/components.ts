import {getDocs, query, where} from "@firebase/firestore";
import {addDoc, collection, doc, getFirestore,deleteDoc} from "firebase/firestore";
import firebaseApp from "@/config";
import { Movie, User } from './Interfaces';
import {ref} from "vue";


const db = getFirestore(firebaseApp);
const accountRef = collection(db, "account");
const userEmail = ref<string | null>(null);

export const CompareMovieToCollection = async (movie: Movie, userEmail: string): Promise<boolean> => {
    try {
        let userId = '';

        // Query the collection to find the user document with the matching email
        const q = query(accountRef, where('email', '==', userEmail));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            userId = userDoc.id;
            const userDocRef = doc(db, 'account', userId);
            const moviesCollectionRef = collection(userDocRef, 'LikedFilms');
            //Check to see if movie is already in db or not
            const InDb = await checkIfMovieInDB(moviesCollectionRef, movie.id)
            if (InDb) console.log(' Movie In both collections ')
            return InDb
        } else {
            console.log('User not found.');
            return false
        }
    } catch (error) {
        
    }
    return false
};

export const checkIfMovieInDB = async (docData: any, id: number) => {
    try {
        const movieQuery = query(docData, where('id', '==', id));
        const movieQuerySnapshot = await getDocs(movieQuery);

        if (!movieQuerySnapshot.empty) {
            
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error checking if movie is in the collection:', error);
        return false;
    }

};

export const deleteMovieFromCollection = async (movieId: number, userEmail: string) => {
    try {
      const movies = await getMoviesInCollection(userEmail);
  
      const movieToDelete = movies.find((movie) => movie.id === movieId);
      if (!movieToDelete) {
        console.log('Movie not found in the collection.');
        return;
      }
  
      let userId = '';
  
      // Query the collection to find the user document with the matching email
      const userQuery = query(accountRef, where('email', '==', userEmail));
      const userQuerySnapshot = await getDocs(userQuery);
  
      if (!userQuerySnapshot.empty) {
        const userDoc = userQuerySnapshot.docs[0];
        userId = userDoc.id;
      } else {
        console.log('User not found.');
        return;
      }
  
      const moviesCollectionRef = collection(db, 'account', userId, 'LikedFilms');
      const movieQuery = query(moviesCollectionRef, where('id', '==', movieId));
      const movieQuerySnapshot = await getDocs(movieQuery);
  
      if (!movieQuerySnapshot.empty) {
        const movieDoc = movieQuerySnapshot.docs[0];
        const movieDocRef = doc(moviesCollectionRef, movieDoc.id);
        await deleteDoc(movieDocRef);
        console.log(`Deleted movie ${movieToDelete.title} from the collection.`);
      } else {
        console.log('Movie not found in the collection.');
      }
    } catch (error) {
      console.error('Error deleting movie from collection:', error);
    }
};
  
export const addMovieToCollection = async (movie: Movie, movieLink: string, userEmail: string) => {
    try {
        let userId = '';

        // Query the collection to find the user document with the matching email
        const q = query(accountRef, where('email', '==', userEmail));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            userId = userDoc.id;
            const userDocRef = doc(db, 'account', userId);
            const moviesCollectionRef = collection(userDocRef, 'LikedFilms');
            //Check to see if movie is already in db or not
            const InDb = await checkIfMovieInDB(moviesCollectionRef, movie.id)
            if (InDb) {
                return 
            }else {
                console.log('Movie already in collection')
            };

            await addDoc(moviesCollectionRef, {
                id: movie.id,
                title: movie.title,
                overview: movie.overview,
                poster_path: movie.poster_path,
                movieLink
            });

            console.log(`Added movie ${movie.title} to movies collection`);
        } else {
            console.log('User not found.');
        }
    } catch (error) {
        console.error('Error adding movie to collection:', error);
    }
};

export const getMoviesInCollection = async (userEmail: string) => {
    try {
        let userId = '';

        // Query the collection to find the user document with the matching email
        const q = query(accountRef, where('email', '==', userEmail));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            userId = userDoc.id;
            const userDocRef = doc(db, 'account', userId);
            const moviesCollectionRef = collection(userDocRef, 'LikedFilms');

            const moviesQuerySnapshot = await getDocs(moviesCollectionRef);

            if (!moviesQuerySnapshot.empty) {
                return moviesQuerySnapshot.docs.map((doc) => doc.data() as Movie);
            } else {
                console.log('No movies found in the collection.');
                return [];
            }
        } else {
            console.log('User not found.');
            return [];
        }
    } catch (error) {
        console.error('Error retrieving movies from collection:', error);
        return [];
    }
};

export const isMovieInCollection = (movies: Movie[], movieId: number): boolean => {
    return movies.some((movie) => movie.id === movieId);
};

//Friends list functions
export const checkIfFriend = async (docData: any, email: string) => {
    try {
        const friendQuery = query(docData, where('email', '==', email));
        const friendQuerySnapshot = await getDocs(friendQuery);

        if (!friendQuerySnapshot.empty) {
            console.log('User is already a friend');
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error checking if friend', error);
        return false;
    }
};

export const addFriendToCollection = async (friend: User, userEmail: string) => {
    try {
        if (friend.email === userEmail) {
            console.log("You cannot add yourself as a friend.");
            return;
          }

        let userId = '';

        // Query the collection to find the user document with the matching email
        const q = query(accountRef, where('email', '==', userEmail));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            userId = userDoc.id;
            const userDocRef = doc(db, 'account', userId);
            const friendCollectionRef = collection(userDocRef, 'FriendList');
            //Check to see if friend is already in db or not
            const InDb = await checkIfFriend(friendCollectionRef, friend.email)
            if (InDb) return;

            await addDoc(friendCollectionRef, {
                email: friend.email,
                username: friend.username
            });

            console.log(`Added ${friend.username} to friends list`);
        } else {
            console.log('User not found.');
        }
    } catch (error) {
        console.error('Error adding Friend:', error);
    }
};

export const deleteFriendFromCollection = async (friendEmail: string, userEmail: string) => {
    try {
        const friends = await getFriendsInCollection(userEmail);

        const friendToDelete = friends.find((friend) => friend.email === friendEmail);
        if (!friendToDelete) {
            console.log('Friend not found in the collection.');
            return;
        }

        let userId = '';

        // Query the collection to find the user document with the matching email
        const userQuery = query(accountRef, where('email', '==', userEmail));
        const userQuerySnapshot = await getDocs(userQuery);

        if (!userQuerySnapshot.empty) {
            const userDoc = userQuerySnapshot.docs[0];
            userId = userDoc.id;
        } else {
            console.log('User not found.');
            return;
        }

        const friendCollectionRef = collection(db, 'account', userId, 'FriendList');
        const friendQuery = query(friendCollectionRef, where('email', '==', friendEmail));
        const friendQuerySnapshot = await getDocs(friendQuery);

        if (!friendQuerySnapshot.empty) {
            const friendDoc = friendQuerySnapshot.docs[0];
            const friendDocRef = doc(friendCollectionRef, friendDoc.id); 
            await deleteDoc(friendDocRef);
            console.log(`Removed friend ${friendToDelete.username} from the collection.`);
        } else {
            console.log('Friend not found in the collection.');
        }
    } catch (error) {
        console.error('Error deleting friend from collection:', error);
    }
};

export const getFriendsInCollection = async (userEmail: string) => {
    try {
        let userId = '';

        // Query the collection to find the user document with the matching email
        const q = query(accountRef, where('email', '==', userEmail));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            userId = userDoc.id;
            const userDocRef = doc(db, 'account', userId);
            const friendCollectionRef = collection(userDocRef, 'FriendList');

            const friendQuerySnapshot = await getDocs(friendCollectionRef);

            if (!friendQuerySnapshot.empty) {
                return friendQuerySnapshot.docs.map((doc) => doc.data() as User);
            } else {
                console.log('No friends found in the collection.');
                return [];
            }
        } else {
            console.log('User not found.');
            return [];
        }
    } catch (error) {
        console.error('Error retrieving friends from collection:', error);
        return [];
    }
};

export const getAllUsers = async () => {
    try {
        const userCollectionRef = collection(db, 'account');
        const userQuerySnapshot = await getDocs(userCollectionRef);
        if (!userQuerySnapshot.empty) {
            return userQuerySnapshot.docs.map((doc) => doc.data() as User);
        } else {
            console.log('No users found in Database');
            return [];
        }
    } catch (error) {
        console.log('Error fetching users from Database:', error);
        return [];
    }
};

export function replaceSpacesWithUnderscores(username: string) {
    const modifiedUsername = username.replace(/\s/g, '_');
    return {
      modifiedUsername,
      displayUsername: username
    };
};




