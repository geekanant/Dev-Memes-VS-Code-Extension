// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import axios, { AxiosResponse } from "axios";
let res: AxiosResponse<any>;

const fetchResults = async () => {
  try {
    res = await axios.get("http://meme-api.com/gimme/programmingmemes");
  } catch (err) {
    console.log(err);
  }
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  const provider = new DevMemesSearchView(context.extensionUri);
  await fetchResults();
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      DevMemesSearchView.viewType,
      provider
    )
  );
}

class DevMemesSearchView implements vscode.WebviewViewProvider {
  public static readonly viewType = "developer-memes.showMemes";
  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };
    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "main.css")
    );

    return `<!DOCTYPE html>
			  <html lang="en">
			  <head>
				  <meta charset="UTF-8">
				  <meta img-src ${webview.cspSource} https:;  style-src ${webview.cspSource};"
				  />
				  <meta name="viewport" content="width=device-width, initial-scale=1.0">
				  <link href="${styleMainUri}" rel="stylesheet">
				  <title>DevMemes Search</title>
			  </head>
			  <body>
				  <a>
					  <button onclick="ChangeHref()" id="dev-memes" >Reload</button>
				  </a>
          <img src=${res.data.url} id="img-meme"></img>
					  <script>
						  function ChangeHref(){
                fetch('http://meme-api.com/gimme/programmingmemes', {
                  method: 'GET'
                })
                .then(res => res.json())
                .then(data => {
                  console.log(data.url)
                  document.getElementById("img-meme").src=data.url;
                })
                .catch(err => {
                  console.log(err)
                })
						  }
					  </script>
				  </body>
			  </html>`;
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}
