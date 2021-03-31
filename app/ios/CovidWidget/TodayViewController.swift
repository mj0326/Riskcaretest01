//
//  TodayViewController.swift
//  CovidWidget
//
//  Created by SunWoong Choi on 2021/03/17.
//

import UIKit
import NotificationCenter


struct Shared:Decodable {
  let text: String
}

class TodayViewController: UIViewController, NCWidgetProviding {
  
  //CHANGE THE GROUP NAME
  let userDefaults = UserDefaults(suiteName:"group.com.covid.sk")
  
  @IBOutlet weak var label: UILabel!
  
  override func viewDidLoad() {
    super.viewDidLoad()
    // Do any additional setup after loading the view.
    
    //ADD THIS
    do{
      print("Wtf");
      let shared = userDefaults?.string(forKey: "data")
      if(shared != nil){
        let data = try JSONDecoder().decode(Shared.self, from: shared!.data(using: .utf8)!)
        label.text = data.text
      }
    }catch{
      print(error)
    }
  }
  
  func widgetPerformUpdate(completionHandler: (@escaping (NCUpdateResult) -> Void)) {
    // Perform any setup necessary in order to update the view.
    
    // If an error is encountered, use NCUpdateResult.Failed
    // If there's no update required, use NCUpdateResult.NoData
    // If there's an update, use NCUpdateResult.NewData
    
    completionHandler(NCUpdateResult.newData)
  }
  
}
