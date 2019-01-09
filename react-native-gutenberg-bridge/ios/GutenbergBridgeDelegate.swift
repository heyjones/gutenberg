public typealias MediaPickerDidPickMediaCallback = (String?) -> Void

public protocol GutenbergBridgeDelegate: class {
    /// Tells the delegate that Gutenberg had returned the requested HTML content.
    /// You can request HTML content by calling `requestHTML()` on a Gutenberg bridge instance.
    ///
    /// - Parameters:
    ///   - html: The current HTML presented by the editor.
    ///   - changed: True if the given HTML presents changes from the last request or initial value.
    func gutenbergDidProvideHTML(_ html: String, changed: Bool)
    
    /// Tells the delegate that Gutenberg has provided the title.
    /// You can request the title by calling `requestTitle()` on a Gutenberg bridge instance.
    ///
    /// - Parameters:
    ///   - title: The title as shown in the editor.
    ///   - changed: True if the given title presents changes from the last request or initial value.
    func gutenbergDidProvideTitle(_ title: String, changed: Bool)

    /// Tells the delegate that an image block requested an image from the media picker.
    ///
    /// - Parameter callback: A callbak block to be called with the selected
    ///                       image Url or nil to signal that the action was canceled.
    func gutenbergDidRequestMediaPicker(with callback: @escaping MediaPickerDidPickMediaCallback)

    /// Tells the delegate that the Gutenberg module has finished loading.
    ///
    func gutenbergDidLoad()


    /// Tells the delegate every time the editor has finished layout.
    ///
    func gutenbergDidLayout()
}

// MARK: - Optional GutenbergBridgeDelegate methods

public extension GutenbergBridgeDelegate {
    func gutenbergDidLoad() { }
    func gutenbergDidLayout() { }
}
