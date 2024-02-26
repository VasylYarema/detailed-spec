import style from './App.module.css'
import Sidebar from './components/Sidebar/Sidebar'
import Main from './components/Main/Main'
import { useEffect } from 'react';

function App() {

	useEffect(() => {
		alert('This task took 7.8 hours to complete.');
	}, [])
	return (
		<div className={style.App}>
			<Sidebar />
			<Main />
		</div>
	)
}

export default App
