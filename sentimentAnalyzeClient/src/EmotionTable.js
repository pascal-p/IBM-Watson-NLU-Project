import React from 'react';
import './bootstrap.min.css';

class EmotionTable extends React.Component {
    render() {
      return (
        <div className="mt-1 ml-1 mr-1">
          <table className="table table-bordered">
            <tbody>
            {
              // Write code to use the .map method that you worked on in the Hands-on React lab to extract the emotions
              Object.entries(this.props.emotions).map((emo) => {
                return (
                  <tr>
                    <td>{emo[0]}</td><td>{emo[1]}</td>
                  </tr>
                );
              })
            }
            </tbody>
          </table>
        </div>
      );
    }

}
export default EmotionTable;
