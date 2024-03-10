import tensorflow as tf

# Load your TensorFlow model
model = tf.keras.models.load_model('staindetection.h5')

# Determine input type
input_shape = model.input_shape
print("Input shape:", input_shape)

# Determine output type
output_shape = model.output_shape
print("Output shape:", output_shape)
