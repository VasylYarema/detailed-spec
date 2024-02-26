import style from './App.module.css'
import Sidebar from './components/Sidebar/Sidebar'
import Main from './components/Main/Main'

function App() {
	return (
		<div className={style.App}>
			<Sidebar />
			<Main />
		</div>
	)
}

export default App
