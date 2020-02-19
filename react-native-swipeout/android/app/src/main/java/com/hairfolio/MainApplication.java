package com.hairfolio;

import android.app.Application;

import com.facebook.CallbackManager;
import com.facebook.react.ReactApplication;
import com.horcrux.svg.SvgPackage;
import com.lewin.qrcode.QRScanReaderPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import fr.snapp.imagebase64.RNImgToBase64Package;
import cl.json.RNSharePackage;
import com.rnfs.RNFSPackage;
import io.invertase.firebase.RNFirebasePackage;
import com.jimmydaddy.imagemarker.ImageMarkerPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.barefootcoders.android.react.KDSocialShare.KDSocialShare;
import com.reactnativenavigation.bridge.NavigationReactPackage;
import com.zyu.ReactNativeWheelPickerPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.imagepicker.ImagePickerPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.wix.RNCameraKit.RNCameraKitPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.cmcewen.blurview.BlurViewPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new SvgPackage(),
            new QRScanReaderPackage(),
            new PickerPackage(),
            new RNImgToBase64Package(),
            new RNSharePackage(),
            new RNFSPackage(),
            new RNFirebasePackage(),
            new ImageMarkerPackage(),
            new NavigationReactPackage(),
            new ImageResizerPackage(),
            new KDSocialShare(),
            new ReactNativeWheelPickerPackage(),
            new ReactVideoPackage(),
            new VectorIconsPackage(),
            new RNSpinkitPackage(),
            new LinearGradientPackage(),
            new ImagePickerPackage(),
            new RNFetchBlobPackage(),
            new FBSDKPackage(mCallbackManager),
            new ReactNativeContacts(),
            new RNCameraKitPackage(),
            new RCTCameraPackage(),
            new BlurViewPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }
}
