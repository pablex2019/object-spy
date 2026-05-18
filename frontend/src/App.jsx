import { useState } from 'react';
import axios from 'axios';

function App() {
  const [url, setUrl] = useState(
    'https://the-internet.herokuapp.com/login'
  );
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState('');

  const inspectPage = async () => {
    try {
      setLoading(true);
      setScript(''); // Limpiar script anterior

      const response = await axios.post(
        'http://localhost:3001/inspect',
        { url }
      );

      setData(response.data);
    } catch (error) {
      console.error(error);
      alert('Error al analizar la página');
    } finally {
      setLoading(false);
    }
  };

  const generateScript = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3001/generate-script',
        {
          elements: data.elements,
        }
      );

      console.log('Respuesta del backend:', response.data);
      setScript(response.data.script);
    } catch (error) {
      console.error(error);
      alert('Error al generar el script');
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copiado al portapapeles');
    } catch (error) {
      console.error(error);
      alert('No se pudo copiar');
    }
  };

  return (
   <div className="min-h-screen bg-gray-100 p-8">
		<div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Object Spy</h1>

      <div className="flex gap-3 mb-6">
		  <input
			type="text"
			value={url}
			onChange={(e) => setUrl(e.target.value)}
			placeholder="https://example.com"
			className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
		  />

		  <button
			onClick={inspectPage}
			className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
		  >
			Analizar
		  </button>
		</div>

      {loading && <p>Analizando...</p>}

      {data && (
        <>
          <h2>{data.title}</h2>
          <p>Total de elementos: {data.totalElements}</p>

          <button
			  onClick={generateScript}
			  disabled={!data}
			  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium"
			>
			  Generar Script Playwright
			</button>

          {script && (
			  <div className="mt-8">
				<div className="flex justify-between items-center mb-3">
				  <h2 className="text-xl font-semibold text-gray-800">
					Script de Playwright
				  </h2>

				  <button
					onClick={() => copyToClipboard(script)}
					className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-lg text-sm"
				  >
					Copiar Script
				  </button>
				</div>

				<pre className="bg-gray-900 text-green-400 p-4 rounded-xl overflow-x-auto text-sm">
				  {script}
				</pre>
			  </div>
			)}

          <div className="mt-8">
			  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
				Elementos encontrados
			  </h2>

			  <div className="overflow-x-auto">
				<table className="min-w-full border border-gray-200 rounded-xl overflow-hidden text-sm">
				  <thead className="bg-gray-100">
					<tr>
					  <th className="p-3 text-left">Tag</th>
					  <th className="p-3 text-left">Texto</th>
					  <th className="p-3 text-left">ID</th>
					  <th className="p-3 text-left">Name</th>
					  <th className="p-3 text-left">CSS Selector</th>
					  <th className="p-3 text-left">XPath</th>
					  <th className="p-3 text-left">Acciones</th>
					</tr>
				  </thead>

				  <tbody>
					{data.elements.map((el, index) => (
					  <tr
						key={index}
						className="border-t hover:bg-gray-50"
					  >
						<td className="p-3">{el.tag}</td>
						<td className="p-3 max-w-xs truncate">
						  {el.text}
						</td>
						<td className="p-3">{el.id}</td>
						<td className="p-3">{el.name}</td>
						<td className="p-3 font-mono text-xs max-w-xs break-all">
						  {el.cssSelector}
						</td>
						<td className="p-3 font-mono text-xs max-w-xs break-all">
						  {el.xpath}
						</td>
						<td className="p-3">
						  <div className="flex gap-2">
							<button
							  onClick={() =>
								copyToClipboard(el.cssSelector)
							  }
							  className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded text-xs"
							>
							  CSS
							</button>

							<button
							  onClick={() =>
								copyToClipboard(el.xpath)
							  }
							  className="bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded text-xs"
							>
							  XPath
							</button>
						  </div>
						</td>
					  </tr>
					))}
				  </tbody>
				</table>
			  </div>
			</div>
        </>
      )}
    </div>
	</div>
  );
}

export default App;