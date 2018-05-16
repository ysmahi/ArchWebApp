import React, { Component } from 'react'
import TreeNavigator from './GenericComponents/TreeNavigator'

class StartingInterface extends Component {
  state = {
    rawTree: 'Hello',
  }

  componentWillMount(){
    /* Pour chercher le sha d'une branche (master ici) et aller chercher les éléments qui composent la branche
    axios.get("https://api.github.com/repos/ysmahi/ArchiTest/branches/master")
      .then((res) =>{
        let sha = res.data.commit.sha;
        console.log("in get sha branch");
        console.log(sha);
        axios.get("https://api.github.com/repos/ysmahi/ArchiTest/git/trees/" + sha)
          .then((response) => {
            console.log('blabla');
            console.log(response);
            this.setState({rawTree: response.data.tree[0].path});
          })
      }); */

    /* To retrieve xml data from github repo and transform it to json to be reusable later
    axios.get("https://api.github.com/repos/ysmahi/ArchiTest/contents/model/application/02643cbc/ApplicationComponent_1393.xml")
      .then((response) =>{
        let encodedContent = response.data.content;
        let contentElement = atob(encodedContent);
        console.log("bibmbob");
        console.log(contentElement);
        let jsonContentElement = xml2json(contentElement);
        console.log(jsonContentElement);
        }) */

    /* To update a github file
    Careful, sha of every blobs are modified by each push
    let content = {
      "message": "Test modification Application_1393",
      "committer": {
        "name": "Yazid Smahi",
        "email": "yazidsmahi@gmail.com"
      },
      "content": "PGFyY2hpbWF0ZTpBcHBsaWNhdGlvbkNvbXBvbmVudAogICAgeG1sbnM6YXJjaGltYXRlPSJodHRwOi8vd3d3LmFyY2hpbWF0ZXRvb2wuY29tL2FyY2hpbWF0ZSIKICAgIG5hbWU9IlRlc3QiCiAgICBpZD0iMTM5MyIvPg==",
      "sha": "455dfe4143f9e71f87ba6965bc3c0908958f597d"
    }

    axios.put("https://api.github.com/repos/ysmahi/ArchiTest/contents/model/application/02643cbc/ApplicationComponent_1393.xml",
      content,
      {headers : {'Authorization': 'Bearer b99616d4031676adec3c2fd9ef33d9ec404f0809',
          'Content-Type': 'application/json'}})
    .then((response) => {
      console.log("modifieedddddddd");
    })
    */


  }

  render () {
    return(
      <div>
        <TreeNavigator />
      </div>
    );
  }
}

export default StartingInterface;

/* Creates a request typical structure */
export function creerStructureFormulaire(donneesFormulaire) {
  let structureFormulaire = [];
  for (let proprietes in donneesFormulaire) {
    let encodedKey = encodeURIComponent(proprietes);
    let encodedValue = encodeURIComponent(donneesFormulaire[proprietes]);
    structureFormulaire.push(encodedKey + "=" + encodedValue);
  }
  structureFormulaire = structureFormulaire.join("&");
  return structureFormulaire;
}