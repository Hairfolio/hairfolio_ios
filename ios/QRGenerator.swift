//
//  QRGenerator.swift
//  Hairfolio
//
//  Created by agilemac-32 on 20/05/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import UIKit
import QRCode
import Photos




@objc(QRGenerator)
class QRGenerator: NSObject{
  
  

  @objc func generateQRCode(_ qrCodeUrl: String) -> String {
    
    let screenRes = UIScreen.main.bounds.size;
   
    print("screen size ==> \(screenRes)");
    let orgWidth = (screenRes.width) + (screenRes.width/2);
    print("screen size ==> \(screenRes)");

    var f_size = 0;
    
    if(screenRes.height > 800){
//       f_size = 40;
      f_size = 100;
    }else{
//      f_size = 50;
      f_size = 110;
    }
    
    print("QR size ==> \(f_size)");

   
    
    var topImage : UIImage?
    topImage = {
//            var qrCode = QRCode(getStringFromDictionary(dict: param))!
      var qrCode = QRCode(qrCodeUrl)!
      qrCode.size = CGSize(width: f_size, height: f_size)
//      qrCode.backgroundColor = CIColor(cgColor: UIColor.blue.cgColor)
      qrCode.color = CIColor(rgba: "16a085")
      qrCode.backgroundColor = CIColor(rgba: "000")
      qrCode.errorCorrection = .High
      return qrCode.image
    }()
    
    
    let strUrl =  self.storeImage(topImage!)
   
    return strUrl
  }
  
  
  @objc func storeImage(_ image:UIImage) -> String {
    
    var strUrl = String();
    
    let documentsDirectory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
    // choose a name for your image
    let uniqueDate = self.getImageUniqueName();
    let fileName = "image\(uniqueDate).jpg"
    // create the destination file url to save your image
    let fileURL = documentsDirectory.appendingPathComponent(fileName)
    
    
    // get your UIImage jpeg data representation and check if the destination file url already exists
    if let data = image.jpegData(compressionQuality:  1.0),
      !FileManager.default.fileExists(atPath: fileURL.path) {
      
      do {
        // writes the image data to disk
        try data.write(to: fileURL)
        
        print("file saved => \(fileURL)")
        strUrl = fileURL.absoluteString
        //        return fileURL.absoluteString
        
      } catch {
        print("error saving file:", error)
        strUrl = ""
        
      }
    }
    return strUrl
  }
  
  
 @objc func storeImage_working(_ image:UIImage) -> String {
  
  var strUrl = String();
    
    let documentsDirectory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
    // choose a name for your image
    let uniqueDate = self.getImageUniqueName();
    let fileName = "image\(uniqueDate).jpg"
    // create the destination file url to save your image
    let fileURL = documentsDirectory.appendingPathComponent(fileName)
    // get your UIImage jpeg data representation and check if the destination file url already exists
    if let data = image.jpegData(compressionQuality:  1.0),
      !FileManager.default.fileExists(atPath: fileURL.path) {
      
      do {
        // writes the image data to disk
        try data.write(to: fileURL)
        
        print("file saved => \(fileURL)")
        strUrl = fileURL.absoluteString
//        return fileURL.absoluteString
        
      } catch {
        print("error saving file:", error)
        strUrl = ""
        
      }
    }
    return strUrl
  }
  
  
  func getImage(){
    let nsDocumentDirectory = FileManager.SearchPathDirectory.documentDirectory
    let nsUserDomainMask    = FileManager.SearchPathDomainMask.userDomainMask
    let paths               = NSSearchPathForDirectoriesInDomains(nsDocumentDirectory, nsUserDomainMask, true)
    if let dirPath          = paths.first
    {
      let imageURL = URL(fileURLWithPath: dirPath).appendingPathComponent("image.png")
      let image    = UIImage(contentsOfFile: imageURL.path)
      // Do whatever you want with the image
    }
  }
  
  func getImageUniqueName()->String{
    //generate unique name for image store in local device temp
    let dateFormatter = DateFormatter()
    dateFormatter.dateFormat = "y_MM_dd_H_m_ss_SSSS"
    //df.string(from: d) // -> "2016_11_17_17_51_15_1720"
    let convertedDate = dateFormatter.string(from: Date())
    return convertedDate
  }
  
  
  func testFunction() {
    print("This function works")
  }
  
  @objc func getDATA(){
    
    //implement you method
    NSLog("*******************************")
    NSLog("GET API")
    NSLog("*******************************")
    //}
    
  }

  @objc func addEvent(_ name: String, callback: (NSArray) -> ()) -> Void {
    // Date is ready to use!
    
    print("This function works")
    let qrUrl = self.generateQRCode(name)
    
    callback([qrUrl]);
    
  }
  

  
  @objc func shareToInstagram(_ url:String){
    
    var images = [PHAsset]()
    
    let newUrl = URL(fileURLWithPath: url)
    
    print("NEW URL ==> \(newUrl)")
    
    if let img = UIImage(contentsOfFile: newUrl.path){
      UIImageWriteToSavedPhotosAlbum(img, nil, nil, nil);
    }
    
    let assets = PHAsset.fetchAssets(with: PHAssetMediaType.image, options: nil)
    assets.enumerateObjects({ (object, count, stop) in
      // self.cameraAssets.add(object)
      images.append(object)
    })
    
//    print("INSTA URL ==> \(images.last?.localIdentifier)")
    
    let imageUpload = String(stringLiteral: (images.last?.localIdentifier)!)
    
    let instagramString = "instagram://library?LocalIdentifier=/\(imageUpload)"
    DispatchQueue.main.async {
      if #available(iOS 10.0, *) {
        if(UIApplication.shared.canOpenURL(URL(fileURLWithPath: instagramString)))
        {
          UIApplication.shared.open(URL(string: instagramString)!, options: [:], completionHandler: nil)
        }
        else
        {
          
          let alert = UIAlertController(title: "Instagram not installed", message: "To share on Instagram, please install the Instagram app first.", preferredStyle: .alert)
          alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
          
          let ctrl: UIViewController? = UIApplication.shared.delegate?.window?!.rootViewController
          ctrl?.present(alert, animated: true)
        }
        
      } else {
        // Fallback on earlier versions
      }
    }
  }
  
}


